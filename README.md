Seatours.Meteor
===============

How Deploy
----------

On Seatours.Meteor directory:

`meteor bundle ../bundle.tgz`

> If Seatours.Meteor is a recent clone do a `mrt` before bundle it.

Go to bundle.tgz directory and:

`tar -zxvf bundle.tgz`

Restart or:

`$ PORT=8080 MONGO_URL=mongodb://localhost:27017/bookseatours ROOT_URL=https://bookseatours.com.is node bundle/main.js`

sudo may be needed.

