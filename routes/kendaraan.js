const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const connection = require('../config/db');
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// Konfigurasi multer untuk upload file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Jenis file tidak diizinkan'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Membuat kendaraan baru
router.post(
    '/kendaraan',
    upload.single('Gambar_kendaraan'),
    [
        // Validasi
        body('no_pol').notEmpty(),
        body('nama_kendaraan').notEmpty(),
        body('id_transmisi').notEmpty(),
    ],
    (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(422).json({
                error: error.array(),
            });
        }
        let Data = {
            no_pol: req.body.no_pol,
            nama_kendaraan: req.body.nama_kendaraan,
            id_transmisi: req.body.id_transmisi,
            Gambar_kendaraan: req.file ? req.file.filename : null,
        };
        connection.query('INSERT INTO kendaraan SET ?', Data, (err, rows) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Server Error',
                });
            } else {
                return res.status(201).json({
                    status: true,
                    message: 'Kendaraan berhasil ditambahkan',
                    data: rows,
                });
            }
        });
    }
);

// Mendapatkan semua kendaraan
router.get('/kendaraan', (req, res) => {
    connection.query('SELECT * FROM kendaraan', (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Kendaraan',
                data: rows,
            });
        }
    });
});

// Mendapatkan kendaraan berdasarkan ID
router.get('/kendaraan/:id', (req, res) => {
    const id = req.params.id;
    connection.query(`SELECT * FROM kendaraan WHERE id_kendaraan = ${id}`, (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        }
        if (rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'Kendaraan tidak ditemukan',
            });
        }
        return res.status(200).json({
            status: true,
            message: 'Data Kendaraan',
            data: rows[0],
        });
    });
});

// Mengupdate kendaraan berdasarkan ID
router.patch(
    '/kendaraan/:no_pol',
    upload.single('Gambar_kendaraan'),
    [
        body('no_pol').notEmpty(),
        body('nama_kendaraan').notEmpty(),
        body('id_transmisi').notEmpty(),
    ],
    (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(422).json({
                error: error.array(),
            });
        }
        const no_pol = req.params.no_pol;
        // Lakukan pengecekan apakah ada file yang diunggah
        const gambar = req.file ? req.file.filename : null;
        connection.query(`SELECT * FROM kendaraan WHERE no_pol = ?`, [no_pol], (err, rows) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Server Error',
                });
            }
            if (rows.length === 0) {
                return res.status(404).json({
                    status: false,
                    message: 'Kendaraan tidak ditemukan',
                });
            }
            const namaFileLama = rows[0].Gambar_kendaraan;

            // Hapus file lama jika ada
            if (namaFileLama && gambar) {
                const pathFileLama = path.join(__dirname, '../public/images', namaFileLama);
                fs.unlinkSync(pathFileLama);
            }

            let Data = {
                no_pol: req.body.no_pol,
                nama_kendaraan: req.body.nama_kendaraan,
                id_transmisi: req.body.id_transmisi,
                Gambar_kendaraan: gambar,
            };
            connection.query(`UPDATE kendaraan SET ? WHERE no_pol = ?`, [Data, no_pol], (err, rows) => {
                if (err) {
                    return res.status(500).json({
                        status: false,
                        message: 'Server Error',
                    });
                } else {
                    return res.status(200).json({
                        status: true,
                        message: 'Update Kendaraan Success..!',
                    });
                }
            });
        });
    }
);

// Menghapus kendaraan berdasarkan ID
router.delete('/kendaraan/:no_pol', (req, res) => {
    const no_pol = req.params.no_pol;
    connection.query(`SELECT * FROM kendaraan WHERE no_pol = ?`, [no_pol], (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        }
        if (rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'Kendaraan tidak ditemukan',
            });
        }
        const namaFileLama = rows[0].Gambar_kendaraan;

        // Hapus file lama jika ada
        if (namaFileLama) {
            const pathFileLama = path.join(__dirname, '../public/images', namaFileLama);
            fs.unlinkSync(pathFileLama);
        }

        connection.query(`DELETE FROM kendaraan WHERE no_pol = ?`, [no_pol], (err, rows) => {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Server Error',
                });
            } else {
                return res.status(200).json({
                    status: true,
                    message: 'Kendaraan berhasil dihapus',
                });
            }
        });
    });
});

module.exports = router;
