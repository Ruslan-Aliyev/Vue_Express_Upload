const express = require('express');
const multer = require('multer'); // Handle multipart
const sharp = require('sharp'); // Image processing
const fs = require('fs');
const path = require('path');

const app = express();
app.use('/static', express.static(path.join(__dirname, 'static')));

const fileFilter = function(req, file, cb) 
{
	const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

	if (!allowedTypes.includes(file.mimetype))
	{
		const error = new Error("Wrong file type");
		error.code = "LIMIT_FILE_TYPES";
		return cb(error, false);
	}

	cb(null, true);
};

const MAX_SIZE = 200000;

const upload = multer({
	dest: './uploads/',
	fileFilter,
	limits: {
		fileSize: MAX_SIZE
	}
});

// routes
app.post('/upload', upload.single("file"), (req, res) => {
	res.json({file: req.file});
});

app.post('/multiple', upload.array("files"), (req, res) => {
	res.json({file: req.files});
});

app.post('/dropzone', upload.single("file"), async (req, res) => {
	try
	{
		await sharp(req.file.path)
			// .resize(300)
			// .background('white')
			// .embed()
			.toFile(`./static/${req.file.originalname}`);

		fs.unlink(req.file.path, () => {
			res.json({file: `/static/${req.file.originalname}`});
		});
	}
	catch (err)
	{
		res.status(422).json({err});
	}

	//res.json({file: req.files});
	// Cant do this: https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client
});

app.use(function(err, req, res, next) {
	if (err.code === "LIMIT_FILE_TYPES")
	{
		res.status(422).json({error: "Only images are allowed"});
		return;
	}

	if (err.code === "LIMIT_FILE_SIZE")
	{
		res.status(422).json({error: `Too large. Max size is ${MAX_SIZE/1000}Kb`});
		return;
	}
});

app.listen(3344, () => console.log("running on port 3344"));