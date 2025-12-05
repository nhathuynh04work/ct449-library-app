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
        },
        {
            path: "/register",
            name: "register",
            component: RegisterView,
        },
        {
            path: "/portal",
            component: PortalLayout,
            children: [
                {
                    path: "books",
                    name: "book-list",
                    component: BookListView,
                    meta: { requiresAuth: false },
                },
                {
                    path: "books/:id",
                    name: "book-detail",
                    component: BookDetailView,
                    meta: { requiresAuth: false },
                },
                {
                    path: "history",
                    name: "borrow-history",
                    component: BorrowHistoryView,
                    meta: { requiresAuth: true },
                },
                { path: "", redirect: { name: "book-list" } },
            ],
        },

        {
            path: "/admin",
            component: AdminLayout,
            meta: { requiresAuth: true },
            children: [
                { path: "dashboard", name: "admin-dashboard", component: DashboardView },
                { path: "books", name: "admin-books", component: BookManager },
                { path: "resources", name: "admin-resources", component: ResourceManager },
                { path: "loans", name: "admin-loans", component: LoanManager },
                { path: "employees", name: "admin-employees", component: EmployeeManager },
                { path: "readers", name: "admin-readers", component: ReaderManager },
                { path: "", redirect: { name: "admin-dashboard" } },
            ],
        },
    ],
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token");
    if (to.meta.requiresAuth && !token) {
        next("/login");
    } else {
        next();
    }
});

export default router;
