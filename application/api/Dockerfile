FROM python:3.7

ADD project /opt/boomslang
ADD bin /opt/bin

RUN pip install -r /opt/boomslang/requirements.txt
RUN [ "chmod", "+x", "/opt/bin/build.sh" ]

WORKDIR /opt/boomslang
