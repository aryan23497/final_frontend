# check_creds.py
import os
import boto3
from dotenv import load_dotenv
from botocore.exceptions import ClientError
load_dotenv("aws.env")
print("ENV AWS_ACCESS_KEY_ID:", bool(os.getenv("AWS_ACCESS_KEY_ID")))
print("ENV AWS_SECRET_ACCESS_KEY:", bool(os.getenv("AWS_SECRET_ACCESS_KEY")))
print("ENV AWS_SESSION_TOKEN:", bool(os.getenv("AWS_SESSION_TOKEN")))
print("ENV AWS_REGION:", os.getenv("AWS_REGION"))

# Try to get caller identity (fast way to validate creds)
sts = boto3.client("sts", region_name=os.getenv("AWS_REGION") or "us-east-1")
try:
    resp = sts.get_caller_identity()
    print("AWS caller identity OK:", resp)
except ClientError as e:
    print("Error calling STS:", e)
