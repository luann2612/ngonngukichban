import { getUserFromToken } from '../helpers/tokenHelper';

const requireRoles = (rolesRequired) => async (req, res, next) => {
    try {
        const user = await getUserFromToken(req, res,);
        if (!user) return;

        if (user.is_locked == 1) {
            return res.status(403).json({ message: 'tai khoan bi khoa' });
        }

        if (!rolesRequired.includes(user.role)) {
            return res.status(403).json({ message: 'khong co quyen truy cap' });
        }

        req.user = user;
        next();

    } catch (error) {
        res.status(401).json({ message: error.message });
    }

}

export { requireRoles };