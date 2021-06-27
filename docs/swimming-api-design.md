## Overview
Application (web or mobile) where swimmers can track their times across the various standard swimming events.

### Use Cases
> - Assume that a swimmer can only see and modify their entries.
> - Assume that a user must register to login and that an SID is generated at that time. Look at serverless tutorial to see how to do this using cognito and APIGW.

#### Swimmer can register account
A swimmer can register for an account. The `username` will be used as the SK to identify their event results.
- Will leverage Cognito for user registration
- Attributes:
	- username (required | must be unique)
	- birthdate (required)
	- mobile number or email (this is an alias)
	- preferred_username - display name they can choose
	- teamname (future custom attribute)

Will leverage User Groups mapped to IAM roles to control access (approach still TBD). Current thought is to have 3 roles:
- Admin can read and edit everything
- User - can view/edit their entries and profile
- Coach - can view/edit entries for swimmers on their team

#### Swimmer gets times/results for an event
A swimmer can retrieve the most recent N times for a particular event.

#### Swimmer can get most recent time for all events
Generate a report of the most recent time for each event that they have swam

#### Swimmer can get PR for an event
Swimmer can see the date and time for their PR for a given event

#### Swimmer can get report of PRs for all events
Generate a report of the most PR date and time for each event that they have swam

#### Swimmer can add a new result
The result must identify the following attributes:
- Event (e.g. Free50SCYD, Free50LCM, Free50SCM)
- Date
- Swim Time
- Location/meet (optional)

#### Other Use Cases
- Ability to modify an existing entry
- Ability to delete an existing entry

## DynamoDB Structure Ideas
### Option 1
> Assume a fixed set of Event prefixes (keys) structured by stroke-distance-unit. For example Free50SCYD, Fly100LM, Back200SCM etc.


**DOES NOT WORK**
This only gives one Item Record for the pk + sk not the range of matches that is desired.

- pk: eventid | swimmerid
- sk: S:swimmerid | SID

| PK | SK | Attributes|
|:--|:--|:--|
| EVT#Free50SCYD | USR#MLEML9912 | eventDate, eventTime |
| USR#MLEML9912 |  SID | Name, Birthdate etc. |
| EVT#Free100SCYD | USR#MLEML9912 | eventDate, eventTime |
| EVT#Free100SCYD | USR#WFLIN87654 | eventDate, eventTime |
| USR#WFLIN87654 | SID | Name, Birthdate etc. |

### Option 2
> Assume a fixed set of Event prefixes (keys) structured by stroke-distance-unit. For example Free50SCYD, Fly100LM, Back200SCM etc.
> ISSUE: What if multiple results on a single day for a given event (example prelims and finals)
> Alternative: Use epoch time (milliseconds) and check that record (pk + sk) does not exist on the slim chance of two simultaneous entries being made. So an entry could be pk: USR#MLEML, sk: FREE50SCYD#<Date.now()>. This lets us have unique rows for a given event, and should provide a sort order.
> The sort order will not work if the user enters old historical results and new results in a single session. So may be no benefit to Date.now() over using a short-uuid.

- pk: USR#username
- sk: USR | FREE50SCYD#DDMMMYYYY

| PK | SK | Attributes|
|:--|:--|:--|
| USR#MLEML9912 | Free50SCYD#22Jan2021 | eventDate, eventTime, pr? |
| USR#MLEML9912 |  SID | Name, Birthdate, Team etc. |
| USR#MLEML9912 | Free100SCYD#22Jan2021 | eventDate, eventTime, pr? |
| USR#MLEML9912 | Free20SCYD#22Jan2021 | eventDate, eventTime, pr? |
| USR#MLEML9912 | Back100SCYD#23Jan2021 | eventDate, eventTime, pr? |
| USR#MLEML9912 | Back200SCYD#23Jan2021 | eventDate, eventTime, pr? |
| USR#WFLIN87654 | SID | Name, Birthdate etc. |
| USR#WFLIN87654 | Back200SCYD#23Jan2021 | eventDate, eventTime, pr? |
| USR#WFLIN87654 | Back100SCYD#23Jan2021 | eventDate, eventTime, pr? |

### Queries and Use Cases
#### List Swimmers
- Scan where SK is SID unless we add a GSI

#### Get details on a particular swimmer
- Get where the PK is the username, and the SK is SID

####  List Times for a Swimmer's Particular Event
- Query where PK is Cognito username, SK begins with eventId sorted
- Sort by event date (most recent first)
- Limit to 10 results

####  List PR Time for a Swimmer's Particular Event
- Query where pk is the eventId, and SK is the cognito username
- Sort by event time (fastest first)
- Limit to 1 results

#### List Swimmers PRs for all events
Without a GSI (add in 2nd iteration) this will be a scan looking for users results (sk === usernsme) and creating map of the fastest time for each event.

#### List Swimmers Recent Results for all events
Without a GSI (add in 2nd iteration) this will be a scan looking for users results (sk === username). This could be tricky since don't think I can add a sort option for a scan (TODO to research this)

#### Delete a single event result
Query where pk is the event, sk is the username, and eventDate attribute selects the desired record.
