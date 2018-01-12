FROM tsr/fedora-node-devel
COPY ./dmserver.js dmserver.js
COPY ./dm.js dm.js
EXPOSE 9000 10000
CMD node dmserver.js $SERVER_PORT 10000 
