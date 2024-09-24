from fastapi import FastAPI, Request, Form, File, UploadFile
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
import cv2
import numpy as np
import io
from fastapi.responses import StreamingResponse

app = FastAPI()

# Montar archivos estáticos (CSS, imágenes, etc.)
app.mount("/static/css", StaticFiles(directory="Templates/StylesCSS"), name="css")
app.mount("/static/images", StaticFiles(directory="Templates/images"), name="images")
app.mount("/static/js", StaticFiles(directory="Templates"), name="js")

# Configurar las plantillas
templates = Jinja2Templates(directory="Templates")


@app.get("/")
async def landing_page(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "title": "Agro Diagnóstico IA"})


@app.get("/upload/")
async def upload_page(request: Request):
    return templates.TemplateResponse("plataforma.html", {"request": request})


@app.post("/upload/")
async def handle_upload(request: Request, file: UploadFile = File(...)):
  content = await file.read()  # Lee el contenido del archivo
  nparr = np.frombuffer(content, np.uint8)  # Convierte a NumPy array
  image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)  # Decodifica la imagen
  gray_img = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)  # Convierte a blanco y negro

  _, buffer = cv2.imencode('.jpg', gray_img)  # Codifica la imagen en JPEG
  byte_io = io.BytesIO(buffer)  # Crea  objeto BytesIO para la imagen
  return StreamingResponse(byte_io, media_type="image/jpeg")  # Devuelve la imagen procesada
