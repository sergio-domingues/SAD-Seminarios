FROM tsr/fedora-node-devel
COPY ./forum.js forum.js
COPY ./dm_remote.js dm_remote.js
EXPOSE 12000
CMD node forum.js $SERVER_PORT 10000 'new messages' 12000 
