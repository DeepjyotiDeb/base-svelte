# Stream-bin!

This is a light-weight file sharing app made using [Svelte-Kit](!https://kit.svelte.dev/).


It uses an s3 bucket to store the files uploaded to it. When the files are uploaded, a presigned url is generated for the files and they are active based on the time set by the user. DynamoDB is used as the database for storing the values of the url and the url-id in which to display the files.

## Pending:
QR Scanner integration

Testing