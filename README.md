# swimming-results-api
## Overview
Application (web, mobile, alexa skill) where swimmers can track their times across the various standard swimming events.

## Use Cases
> - Assume that a swimmer can only see and modify their entries.
> - Assume that a user must register to login and that an SID is generated at that time. Look at serverless tutorial to see how to do this using cognito and APIGW.

### Swimmer can register account
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

### Proposed REST paths
```
# POST result
/swimming/results

# GET results (paginated)
/swimming/results

# GET event results
/swimming/results/{eventId}		// path parameter

# GET personal recoords
/swimming/results/pr

GET event personal record
/swimming/results/pr/{eventId}	// path parameter
```

### Swimmer can add a new result
The result must identify the following attributes:
- Event (e.g. Free50SCYD, Free50LCM, Free50SCM)
- Date
- Swim Time (millseconds)
- Location/meet (optional)

#### POST result
`POST /swimming/results`

```json
{
	event: "Free50SCYD",
	eventDate: "26Jun2021",
	eventTime: 30190,
	meet: "LAC-SRVA Dual Meet"
}
```

### Swimmer can get most recent N times for all events
Generate a report of the most recent times for each event that they have swam.

`GET /swimming/results`



### Swimmer gets times/results for an event
A swimmer can retrieve the most recent N times for a particular event.
`GET /swimming/results/{eventId}`
where `eventId` is a path parameter.

```json
{
	[
		{
			event: "Free50SCYD",
			eventDate: "26Jun2021",
			eventTime: 30190,
			meet: "LAC-SRVA Dual Meet"
		},
		{
			event: "Free50SCYD",
			eventDate: "26Mar2021",
			eventTime: 32190,
			meet: "LAC Time Trials"
		}
	]
}
```

### Swimmer can get PR for an event
Swimmer can see the date and time for their PR for a given event.
`GET /swimming/results/{eventId}/pr`
where `eventId` is a path parameter.

```json
{
	event: "Free50SCYD",
	eventDate: "26Jun2021",
	eventTime: 30190,
	meet: "LAC-SRVA Dual Meet",
	pr: true
}
```

### Swimmer can get report of PRs for all events
Generate a report of the PR dates and times for each event that they have swam

#### Swimmer can get most recent time for all events
Generate a report of the most recent time for each event that they have swam

#### Other Use Cases
- Ability to modify an existing entry
- Ability to delete an existing entry

## TODO Items
- [ ] Refactor REST URLs to match latest proposal
- [ ] For `get all` type queries introduce pagination
- [ ] Refactor 'get' lambdas to handle use with and without an optional path parameter.
	- Maybe introduce a query builder helper function.
