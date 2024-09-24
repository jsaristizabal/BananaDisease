const defaultfile = '/static/images/ImagePlaceHolder.jpg';

const fileInput = document.getElementById('imagen');
const imgHolder = document.getElementById('img');


// Manejar la selección de archivo
fileInput.addEventListener('change', e => {
    if (e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imgHolder.src = e.target.result;  // Muestra la imagen seleccionada
        }
        reader.readAsDataURL(e.target.files[0]);
    } else {
        imgHolder.src = defaultfile;  // Muestra la imagen por defecto si no se selecciona ninguna
    }
});

// Función para procesar la imagen al enviar el formulario
async function procesarImagen() {
    const input = document.getElementById('imagen');
    if (!input.files.length) {
        alert("Por favor, selecciona una imagen.");
        return;
    }
    
    const formData = new FormData();
    formData.append('file', input.files[0]);  // Cambiar 'imagen' a 'file'

    try {
        const response = await fetch('/upload/', {
            method: 'POST',
            body: formData  // Envía el FormData al servidor
        });
        
        if (!response.ok) {
            const errorText = await response.text();  // Captura el texto de error
            console.error('Error:', errorText);  // Muestra el error en la consola
            throw new Error('Error al procesar la imagen');
        }

        // Obtener el blob de la respuesta y crear el objeto URL
        const blob = await response.blob();  // Convierte la respuesta en un Blob
        const imgSrc = URL.createObjectURL(blob);  // Crea una URL para mostrar la imagen

        const resultImage = document.getElementById('resultImage');
        resultImage.src = imgSrc;  // Cambia la fuente de la imagen mostrada a la imagen procesada
        resultImage.style.display = 'block';  // Muestra la imagen procesada
    } catch (error) {
        console.error(error);
        alert("Hubo un problema al procesar la imagen.");  // Maneja cualquier error que ocurra
    }
}

