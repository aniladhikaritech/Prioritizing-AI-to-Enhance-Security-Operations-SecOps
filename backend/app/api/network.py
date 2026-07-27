import io
import socket
import base64
from fastapi import APIRouter, Depends
import qrcode
from app.utils.security import get_current_user
from app.models.user import User

router = APIRouter(prefix="/network", tags=["Network & Access"])

def get_local_ip() -> str:
    """Find local network IP address of the server host"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # Connect to non-routable IP to discover local interface IP
        s.connect(("10.255.255.255", 1))
        local_ip = s.getsockname()[0]
        s.close()
        return local_ip
    except Exception:
        return "127.0.0.1"

@router.get("/qr")
def get_dashboard_qr(current_user: User = Depends(get_current_user)):
    """
    Returns local network IP, mobile dashboard URL, and a Base64-encoded QR code PNG.
    Allows trusted local network users to quickly open the dashboard on mobile devices.
    """
    ip = get_local_ip()
    port = 5173  # Standard Vite frontend dev port
    dashboard_url = f"http://{ip}:{port}"
    
    # Generate QR Code image
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=8,
        border=3,
    )
    qr.add_data(dashboard_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="#00F2FE", back_color="#0D1117")
    
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    qr_base64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    
    return {
        "local_ip": ip,
        "port": port,
        "dashboard_url": dashboard_url,
        "qr_code_base64": f"data:image/png;base64,{qr_base64}"
    }
