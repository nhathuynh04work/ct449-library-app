import { createRouter, createWebHistory } from "vue-router";
import PortalLayout from "@/layouts/PortalLayout.vue";
import AdminLayout from "@/layouts/AdminLayout.vue";

import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import BookListView from "@/views/portal/BookListView.vue";
import BookDetailView from "@/views/portal/BookDetailView.vue";
import BorrowHistoryView from "@/views/portal/BorrowHistoryView.vue";

import DashboardView from "@/views/admin/DashboardView.vue";
import BookManager from "@/views/admin/BookManager.vue";
import ResourceManager from "@/views/admin/ResourceManager.vue";
import LoanManager from "@/views/admin/LoanManager.vue";
import EmployeeManager from "@/views/admin/EmployeeManager.vue";
import ReaderManager from "@/views/admin/ReaderManager.vue";

const APP_NAME = "Storism";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            redirect: "/portal/books",
        },
        {
            path: "/login",
            name: "login",
            component: LoginView,
            meta: { title: "Đăng nhập" },
        },
        {
            path: "/register",
            name: "register",
            component: RegisterView,
            meta: { title: "Đăng ký" },
        },

        {
            path: "/portal",
            component: PortalLayout,
            children: [
                {
                    path: "books",
                    name: "book-list",
                    component: BookListView,
                    meta: { requiresAuth: false, title: "Thư viện sách" },
                },
                {
                    path: "books/:id",
                    name: "book-detail",
                    component: BookDetailView,
                    meta: { requiresAuth: false, title: "Chi tiết sách" },
                },
                {
                    path: "history",
                    name: "borrow-history",
                    component: BorrowHistoryView,
                    meta: { requiresAuth: true, title: "Lịch sử mượn" },
                },
                { path: "", redirect: { name: "book-list" } },
            ],
        },

        {
            path: "/admin",
            component: AdminLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: "dashboard",
                    name: "admin-dashboard",
                    component: DashboardView,
                    meta: { title: "Tổng quan" },
                },
                {
                    path: "books",
                    name: "admin-books",
                    component: BookManager,
                    meta: { title: "Quản lý đầu sách" },
                },
                {
                    path: "resources",
                    name: "admin-resources",
                    component: ResourceManager,
                    meta: { title: "Quản lý tài nguyên" },
                },
                {
                    path: "loans",
                    name: "admin-loans",
                    component: LoanManager,
                    meta: { title: "Theo dõi mượn trả" },
                },
                {
                    path: "employees",
                    name: "admin-employees",
                    component: EmployeeManager,
                    meta: { title: "Quản lý nhân viên" },
                },
                {
                    path: "readers",
                    name: "admin-readers",
                    component: ReaderManager,
                    meta: { title: "Quản lý độc giả" },
                },
                { path: "", redirect: { name: "admin-dashboard" } },
            ],
        },
    ],
});

router.beforeEach((to, from, next) => {
    const pageTitle = to.meta.title;
    if (pageTitle) {
        document.title = `${pageTitle} | ${APP_NAME}`;
    } else {
        document.title = APP_NAME;
    }

    const token = localStorage.getItem("token");
    if (to.meta.requiresAuth && !token) {
        next("/login");
    } else {
        next();
    }
});

export default router;
