import { createRouter, createWebHistory } from 'vue-router'
// import { auth } from '@/stores/auth';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: 'cart',
    },
    {
      path: '/cart',
      name: 'cart',
      component: ()=> import ('@/views/Cart.vue'),
    },
    {
      path: '/reciept',
      name: 'reciept',
      component: ()=> import ('@/views/RecieptMode.vue')
    },
    {
      path: '/dashboard/:id',
      name: 'Dashboard',
      component: ()=> import ('@/views/dashboard.vue'),
      children: [
        {
          path: 'table',
          name: 'table',
          component: ()=> import ('@/components/table.vue')
        },
        {
          path: 'users',
          name: 'Users',
          component: ()=> import ('@/components/users/usersTable.vue')
        },
        {
          path: 'products',
          name: 'Products',
          component: ()=> import ('@/components/products/productsTable.vue')
        },
        {
          path: 'stocks',
          name: 'Stocks',
          component: ()=> import ('@/components/stocks/stocksTable.vue')
        },
        {
          path: 'sales',
          name: 'Sales',
          component: ()=> import ('@/components/sales/salesTable.vue')
        }
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: ()=> import ('@/views/login.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: ()=> import ('@/views/signup.vue')
    },
    {
      path: '/:catchAll(.*)', //catch all pages that does not exist 
      name: '404',
      component: ()=> import ('@/views/Error404.vue'),

    }
  ],
});



export default router
