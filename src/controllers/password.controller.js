// ============================================
// PASSWORD CONTROLLER
// src/controllers/password.controller.js
// ============================================

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { Utilisateur } = require('../models');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');

// Configuration du transporteur email (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// ============================================
// 1. DEMANDER LA RÉINITIALISATION (Forgot Password)
// ============================================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email requis' 
      });
    }

    // Chercher l'utilisateur
    const user = await Utilisateur.findOne({ where: { email } });
    
    // Par sécurité, ne pas révéler si l'email existe ou non
    if (!user) {
      return res.status(200).json({ 
        success: true, 
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé' 
      });
    }

    // Générer un token de réinitialisation sécurisé
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 heure

    // Sauvegarder le token dans la base de données
    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpiry: resetTokenExpiry
    });

    // Construire l'URL de réinitialisation
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Envoyer l'email
    try {
      await transporter.sendMail({
        from: `"AFROCARDS Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: '🔐 Réinitialisation de votre mot de passe AFROCARDS',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #888; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎮 AFROCARDS</h1>
                <p>Réinitialisation de mot de passe</p>
              </div>
              <div class="content">
                <p>Bonjour,</p>
                <p>Vous avez demandé la réinitialisation de votre mot de passe AFROCARDS.</p>
                <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
                <center>
                  <a href="${resetUrl}" class="button">Réinitialiser mon mot de passe</a>
                </center>
                <p><strong>⚠️ Ce lien expire dans 1 heure.</strong></p>
                <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
                <hr>
                <p style="font-size: 12px; color: #888;">
                  Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
                  <a href="${resetUrl}">${resetUrl}</a>
                </p>
              </div>
              <div class="footer">
                <p>© 2025 AFROCARDS - Tous droits réservés</p>
              </div>
            </div>
          </body>
          </html>
        `
      });

      console.log(`✅ Email de réinitialisation envoyé à ${email}`);
    } catch (emailError) {
      console.error('❌ Erreur envoi email:', emailError);
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de l\'envoi de l\'email' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé' 
    });

  } catch (error) {
    console.error('Erreur forgotPassword:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
};

// ============================================
// 2. RÉINITIALISER LE MOT DE PASSE (Reset Password)
// ============================================
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token et nouveau mot de passe requis' 
      });
    }

    // Validation du nouveau mot de passe
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: 'Le mot de passe doit contenir au moins 8 caractères' 
      });
    }

    // Chercher l'utilisateur avec un token valide et non expiré
    const user = await Utilisateur.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiry: { [Op.gt]: new Date() } // Token non expiré
      }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token invalide ou expiré' 
      });
    }

    // Hasher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Mettre à jour le mot de passe et supprimer le token
    await user.update({
      motDePasse: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpiry: null
    });

    console.log(`✅ Mot de passe réinitialisé pour ${user.email}`);

    res.status(200).json({ 
      success: true, 
      message: 'Mot de passe réinitialisé avec succès' 
    });

  } catch (error) {
    console.error('Erreur resetPassword:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
};

// ============================================
// 3. CHANGER LE MOT DE PASSE (User connecté)
// ============================================
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mot de passe actuel et nouveau requis' 
      });
    }

    // Validation du nouveau mot de passe
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        success: false, 
        message: 'Le mot de passe doit contenir au moins 8 caractères' 
      });
    }

    // Récupérer l'utilisateur connecté
    const user = await Utilisateur.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Utilisateur non trouvé' 
      });
    }

    // Vérifier le mot de passe actuel
    const isPasswordValid = await bcrypt.compare(currentPassword, user.motDePasse);

    if (!isPasswordValid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mot de passe actuel incorrect' 
      });
    }

    // Hasher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Mettre à jour
    await user.update({ motDePasse: hashedPassword });

    console.log(`✅ Mot de passe changé pour ${user.email}`);

    res.status(200).json({ 
      success: true, 
      message: 'Mot de passe changé avec succès' 
    });

  } catch (error) {
    console.error('Erreur changePassword:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
};

// ============================================
// 4. VÉRIFIER UN TOKEN (Validation côté frontend)
// ============================================
exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token requis' 
      });
    }

    // Chercher un utilisateur avec ce token valide
    const user = await Utilisateur.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpiry: { [Op.gt]: new Date() }
      }
    });

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        message: 'Token invalide ou expiré' 
      });
    }

    // Masquer partiellement l'email pour la sécurité
    const email = user.email;
    const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3');

    res.status(200).json({ 
      success: true, 
      message: 'Token valide',
      data: {
        email: maskedEmail
      }
    });

  } catch (error) {
    console.error('Erreur verifyResetToken:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
};

module.exports = exports;