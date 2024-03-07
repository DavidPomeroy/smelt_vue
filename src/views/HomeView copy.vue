<script setup>
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

import { useAuthStore, useAzureBillingItemsStore } from '@/stores';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';


const authStore = useAuthStore();
const { user: authUser } = storeToRefs(authStore);


const loading = ref(true);
const dataStore = useAzureBillingItemsStore();
const { azurebillingitems } = storeToRefs(dataStore);


const azurebillingitems_options={
    "pagination":{
        "page_size":50,
        "page":1
    },
    "columns":[
//    "meterCategory"
    ],
    "filters":[
        {
            "column":"meterCategory",
            "comparator":"=",
            "value":"Key Vault"
        }      
    ],
    "sorting":[
        {
            "column":"meterCategory",
            "order":"asc"
        },
        {
            "column":"meterCategory",
            "order":"ASC"
        }
    ]
};
dataStore.getAll(azurebillingitems_options).then((result)=>{
    loading.value=false;
    console.log(result);
});

</script>

<template>
    <div>
        <h1>Hi {{authUser?.user.email}}!</h1>
        <p>You're logged in</p>
        <!-- <DataTable :value="azurebillingitems" lazy paginator :first="first" :rows="10" v-model:filters="filters" ref="dt" dataKey="id"
            :totalRecords="totalRecords" :loading="loading" @page="onPage($event)" @sort="onSort($event)" @filter="onFilter($event)" filterDisplay="row"
            :globalFilterFields="['name','country.name', 'company', 'representative.name']"
            v-model:selection="selectedCustomers" :selectAll="selectAll" @select-all-change="onSelectAllChange" @row-select="onRowSelect" @row-unselect="onRowUnselect" tableStyle="min-width: 75rem"> -->
            


        <DataTable :value="azurebillingitems" tableStyle="min-width: 50rem" paginator :rows="50" :rowsPerPageOptions="[5, 10, 20, 50]"  :loading="loading"  >
    <Column sortable field="meterCategory" header="meterCategory"></Column>
    <Column sortable field="customerName" header="customerName"></Column>
    <Column sortable field="billingMonth" header="billingMonth"></Column>
    <Column sortable field="billingYear" header="billingYear"></Column>
</DataTable>
        <div v-if="azurebillingitems.loading" class="spinner-border spinner-border-sm"></div>
        <div v-if="azurebillingitems.error" class="text-danger">Error loading data: {{azurebillingitems.error}}</div>
    </div>
</template>
