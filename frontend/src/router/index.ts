import { createRouter, createWebHistory } from "vue-router";
import BookListView from "@/views/portal/BookListView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import DashboardView from "@/views/admin/DashboardView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
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
            path: "/portal/books",
            name: "book-list",
            component: BookListView,
            meta: { requiresAuth: true },
        },
        {
            path: "/admin/dashboard",
            name: "admin-dashboard",
            component: DashboardView,
            meta: { requiresAuth: true },
        },
        {
            path: "/",
            redirect: "/login",
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
