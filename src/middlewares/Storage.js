import multer from 'multer';

// Configuración del almacenamiento en disco
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads'); // Especifica la carpeta de destino
  },
  
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop(); // Obtiene la extensión del archivo original
    cb(null, `${Date.now()}.${ext}`);
  }
});

// Configuración del filtro de archivos
const fileFilter = (req, file, cb) => {
  if (file && (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')) {
    cb(null, true); // Aceptar el archivo
  } else {
    cb(new Error('Only .jpg, .jpeg, and .png files are allowed'), false); // Rechazar el archivo
  }
};

// Crear una instancia de multer con la configuración de almacenamiento y el filtro de archivos personalizados
const uploadImg = multer({ storage: storage, fileFilter: fileFilter });

export { uploadImg };