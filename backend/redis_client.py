import redis
from .config import settings

redis_conn = redis.from_url(settings.REDIS_URL, decode_responses=True)

def get_redis():
    return redis_conn
