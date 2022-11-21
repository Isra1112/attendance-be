const logEvent = require('../events/myEmitter');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

class AuthService {
    constructor(staff, personalInfo, contactInfo, workInfo, address, admin) {
        this.staff = staff
        this.personalInfo = personalInfo
        this.contactInfo = contactInfo
        this.workInfo = workInfo
        this.address = address
        this.admin = admin
    }

    async authMobile(email, img) {
        let authUser;
        try {
            let profileData = await this.staff.findOne({
                include: [
                    {
                        model: this.contactInfo,
                        where: { email: email }
                    }
                ]
            });
            if (!profileData) {
                authUser = null;
            } else {
                let profileImage = await this.personalInfo.findByPk(profileData.personalInfoId);
                if (!profileImage.photo) {
                    profileImage.photo = img;
                    await profileImage.save();
                }
                const staffData = await this.staff.findOne({
                    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                    include: [
                        {
                            model: this.personalInfo,
                            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                            include: [
                                {
                                    model: this.address,
                                    attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
                                }
                            ]
                        },
                        {
                            model: this.contactInfo,
                            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                            where: { email: email }
                        },
                        {
                            model: this.workInfo,
                            attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                        }
                    ],
                });
                const token = await axios.post('http://ec2-18-136-210-143.ap-southeast-1.compute.amazonaws.com:3333/token', { email: email });
                const accessToken = token.data.result;
                authUser = {
                    staffData,
                    token: accessToken
                }
            }
        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: 'GET-TOKEN-SERVICE-FAILED',
                logMessage: e
            });
            throw new Error(e);
        }
        return authUser;
    }

    async authWeb(user) {
        const { userName, userPassword } = user;
        let authAdmin;
        try {
            authAdmin = await this.admin.findOne({
                where: {
                    userName: userName
                }
            });
            if (authAdmin && authAdmin.userName === userName) {
                const matchPassword = bcrypt.compareSync(userPassword, authAdmin.userPassword);
                if (matchPassword) {
                    const adminData = await this.admin.findOne({
                        attributes: { exclude: ['userPassword', 'createdAt', 'updatedAt', 'deletedAt'] },
                        include: [
                            {
                                model: this.personalInfo,
                                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                                include: [
                                    {
                                        model: this.address,
                                        attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] }
                                    }
                                ]
                            },
                            {
                                model: this.contactInfo,
                                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                            },
                            {
                                model: this.workInfo,
                                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
                            }
                        ],
                    });
                    const expiresIn = 20000;
                    const accessToken = jwt.sign({ id: '111' }, 'secss', {
                        expiresIn: expiresIn
                    });
                    authAdmin = {
                        adminData,
                        token: accessToken,

                    }
                } else {
                    authAdmin = null;
                }
            } else {
                authAdmin = null;
            }

        } catch (e) {
            logEvent.emit('APP-ERROR', {
                logTitle: 'GET-TOKEN-SERVICE-FAILED',
                logMessage: e
            });
            throw new Error(e);
        }
        return authAdmin;
    }
}

module.exports = AuthService;

