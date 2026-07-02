import asyncio
import aiohttp
from fastapi import HTTPException

class HttpProxy:
    def __init__(self):
        self.session = None

    async def get_session(self):
        if self.session is None or self.session.closed:
            self.session = aiohttp.ClientSession()
        return self.session

    async def handle_request(self, method, url, headers, data=None):
        session = await self.get_session()
        try:
            async with session.request(method, url, headers=headers, data=data) as response:
                resp_body = await response.read()
                return response.status, resp_body, response.headers
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Proxy Error: {str(e)}")

proxy_handler = HttpProxy()
