FROM python:3.11.3-alpine3.18

WORKDIR /app

RUN python3 -m venv /opt/venv

COPY requirements.txt .
RUN . /opt/venv/bin/activate && pip install -r requirements.txt

RUN pip install -r requirements.txt

COPY ./src ./src

EXPOSE 8000
CMD . /opt/venv/bin/activate && uvicorn src.main:app --host 0.0.0.0
