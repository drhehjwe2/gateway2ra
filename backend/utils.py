import uuid
import qrcode
from io import BytesIO
from fastapi import Response
from .config import settings

def generate_uuid():
    return str(uuid.uuid4())

def create_vless_link(uuid_val, name="CyberGate"):
    # vless://uuid@domain:443?path=/vless/{uuid}&security=tls&encryption=none&type=ws&sni=domain#name
    domain = settings.GATEWAY_DOMAIN
    path = f"/vless/{uuid_val}"
    link = f"vless://{uuid_val}@{domain}:443?path={path}&security=tls&encryption=none&type=ws&sni={domain}#{name}"
    return link

def generate_qr_code(text: str):
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(text)
    qr.make(fit=True)
    img = qr.make_image(fill_color="black", back_color="white")
    
    buf = BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()
