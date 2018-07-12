module.exports = (req, res, next) => {
    res.header('Content-Security-Policy', 'upgrade-insecure-requests');
    next();
}
