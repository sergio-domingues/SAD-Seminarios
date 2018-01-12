FROM tsr/fedora-node-devel
COPY ./dmclient.js dmclient.js
COPY ./dm_remote.js dm_remote.js
CMD node dmclient.js 127.0.0.1:$SERVER_PORT 'get public message list' id0
