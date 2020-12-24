import path from 'path';
import { defineConfig } from 'umi';

export default defineConfig({
  dynamicImport: {
    loading: '@/components/Loading',
  },
  dva:{
    immer:true,
  },
  // autd:{},
  // nodeModulesTransform: {
  //   type: 'none',
  // },
  base:'/',
  title:'H5-Vis',
  // routes: [
  //   { exact: true, path: '/', redirect: '/editor' },
  //   { exact: true, path: '/editor', component: 'editor' },
  //   { exact: true, path: '/ide', component: 'ide' },
  //   { exact: true, path: '/home', component: 'home' },
  // ],
  routes: [
    {
      exact: false,
      path: '/',
      component: '@/layouts/index',
      routes: [
        {
          path: '/',
          component: '../pages/home',
        },
        {
          path: '/editor',
          component: '../pages/editor',
        },
        {
          path: '/ide',
          component: '../pages/ide',
        },
      ],
    },
  ],

});
