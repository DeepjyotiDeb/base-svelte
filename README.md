url must have the following params - filename and a 4 letter combination of characters and letters to ensure uniqueness in s3 storage

although files should not stay in storage for longer than 10mins -
can storage time be controlled? not likely since it is being handled by a state machine- can sqs manage time?

server vs page load action
external api calls - make via page action - submitting the file
db calls - make them on the server

do we need server actions....? or should they be api calls?