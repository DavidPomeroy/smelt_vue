<script setup>
import { storeToRefs } from 'pinia';

import { useAuthStore, useUsersStore, useAzureBillingItemsStore } from '@/stores';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
const authStore = useAuthStore();
const { user: authUser } = storeToRefs(authStore);

const usersStore = useUsersStore();
const { users } = storeToRefs(usersStore);

const dataStore = useAzureBillingItemsStore();
const { azurebillingitems } = storeToRefs(dataStore);
dataStore.getAll();
usersStore.getAll();
</script>

<template>
    <div>
        <h1>Hi {{authUser?.email}}!</h1>
        <p>You're logged in with Vue 3 + Pinia & JWT!!</p>
        <h3>Users from secure api end point:</h3>

        <ul v-if="users.length">
            <li v-for="user in users" :key="user.id">{{user.email}} {{user.age}}</li>
        </ul>

        <DataTable :value="azurebillingitems" tableStyle="min-width: 50rem"
        paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]" >
    <Column field="meterCategory" header="meterCategory"></Column>
    <Column field="customerName" header="customerName"></Column>
    <Column field="billingMonth" header="billingMonth"></Column>
    <Column field="billingYear" header="billingYear"></Column>
</DataTable>
        <div v-if="users.loading" class="spinner-border spinner-border-sm"></div>
        <div v-if="users.error" class="text-danger">Error loading users: {{users.error}}</div>
    </div>
</template>
