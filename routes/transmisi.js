const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const connection = require('../config/db');

// Mendapatkan semua transmisi
router.get('/transmisi', (req, res) => {
    connection.query('SELECT * FROM transmisi', (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data Transmisi',
                data: rows,
            });
        }
    });
});

router.post('/transmisi', (req, res) => {
    const { nama_transmisi } = req.body;
    const data = { nama_transmisi };
  
    connection.query('INSERT INTO transmisi SET ?', data, (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: 'Server Error',
        });
      } else {
        return res.status(201).json({
          status: true,
          message: 'Data Transmisi telah ditambahkan',
          data: rows.insertId,
        });
      }
    });
  });

// Mendapatkan transmisi berdasarkan ID
router.get('/transmisi/:id', (req, res) => {
    const id = req.params.id;
    connection.query(`SELECT * FROM transmisi WHERE id_transmisi = ${id}`, (err, rows) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        }
        if (rows.length === 0) {
            return res.status(404).json({
                status: false,
                message: 'Transmisi tidak ditemukan',
            });
        }
        return res.status(200).json({
            status: true,
            message: 'Data Transmisi',
            data: rows[0],
        });
    });
});

// Mengupdate transmisi berdasarkan ID
router.put('/transmisi/:id', (req, res) => {
    const id_transmisi = req.params.id;
    const { nama_transmisi } = req.body;
    const data = { nama_transmisi };
  
    connection.query('UPDATE transmisi SET ? WHERE id_transmisi = ?', [data, id_transmisi], (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: false,
          message: 'Server Error',
        });
      } else {
        return res.status(200).json({
          status: true,
          message: 'Data Transmisi telah diupdate',
        });
      }
    });
  });

// Menghapus transmisi berdasarkan ID
router.delete('/transmisi/:id', (req, res) => {
    const id = req.params.id;
    connection.query(`DELETE FROM transmisi WHERE id_transmisi = ${id}`, (err, result) => {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        }
        return res.status(200).json({
            status: true,
            message: 'Transmisi berhasil dihapus',
        });
    });
});

module.exports = router;
