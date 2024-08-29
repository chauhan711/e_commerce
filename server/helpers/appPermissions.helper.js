class appPermissions{
    constructor() {
        this.Admin_Dashboard = 'Admin-Dashboard';
        this.Saler_Dashboard = 'Saler-Dashboard';
        this.User_Dashboard = 'User-Dashboard';
    }
}
const appPermission = new appPermissions();
module.exports = {appPermission};