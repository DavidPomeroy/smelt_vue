<script setup>

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import { ref, onMounted } from 'vue';
import { fetchWrapper } from '@/helpers';

const baseUrl = `${import.meta.env.VITE_API_URL}/azurebillingitems`;

//import { CustomerService } from '@/service/CustomerService';

onMounted(() => {
    loading.value = true;

    lazyParams.value = {
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

    loadLazyData();
});

const dt = ref();
const loading = ref(false);
const totalRecords = ref(0);
const rows = ref();
const errors = ref();
const selectedRows = ref();
const selectAll = ref(false);
const page = ref(1);
const filters = ref({
    'customerId': {value: '', matchMode: 'contains'},
    'customerName': {value: '', matchMode: 'contains'},
    'meterCategory': {value: '', matchMode: 'contains'},
});
const lazyParams = ref({});


const loadLazyData = (event) => {
    loading.value = true;
    let pagination = lazyParams.value.pagination;
    pagination = {...pagination,page: event?.page +1  || page.value };
    lazyParams.value = { ...lazyParams.value, pagination:pagination};


    fetchWrapper.post(baseUrl, lazyParams.value )
                .then(azurebillingitems => {
                    rows.value = azurebillingitems.data;
                    totalRecords.value = azurebillingitems.row_count;
                    loading.value=false;
                })
                .catch(error => {
                    errors.value=error;
                    console.log(error);
                }
                );

   
};
const onPage = (event) => {
    let pagination = lazyParams.value.pagination;
    pagination = {...pagination,page: event?.page +1  || page.value, page_size:event?.rows};
    lazyParams.value = { ...lazyParams.value, pagination:pagination};
    loadLazyData(event);
};
const onSort = (event) => {
    let sorting = lazyParams.value.sorting;
    sorting = [{...sorting,column: event?.sortField, order:event?.sortOrder===1 ? 'ASC' : 'DESC'}];
    lazyParams.value = { ...lazyParams.value, sorting:sorting};
    loadLazyData(event);
};
const onFilter = (event) => {
    lazyParams.value.filters = filters.value ;
    loadLazyData(event);
};
const onSelectAllChange = (event) => {
    selectAll.value = event.checked;

    if (selectAll.value) {
        selectAll.value = true;
//not sure what to do       
    }
    else {
        selectAll.value = false;
        selectedRows.value = [];
    }
};
const onRowSelect = () => {
    selectAll.value = selectedRows.value.length === totalRecords.value;
};
const onRowUnselect = () => {
    selectAll.value = false;
};

</script>

<template>
    <div>
        <h1>Hi {{authUser?.user.email}}!</h1>
        <p>You're logged in</p>
      {{ lazyParams }}:

      {{ totalRecords }}
    </div>

    <div class="card p-fluid">

        
        <DataTable :value="rows" lazy paginator :first="page" :rows="50" :rowsPerPageOptions="[5, 10, 20, 50]" v-model:filters="filters" ref="dt" dataKey="id"
            :totalRecords="totalRecords" :loading="loading" @page="onPage($event)" @sort="onSort($event)" @filter="onFilter($event)" filterDisplay="row"
            :globalFilterFields="['customerId', 'customerName', 'meterCategory']"
            v-model:selection="selectedRows" :selectAll="selectAll" @select-all-change="onSelectAllChange" @row-select="onRowSelect" @row-unselect="onRowUnselect" tableStyle="min-width: 75rem">
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column field="customerId" header="customerId" filterMatchMode="startsWith" sortable>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>
            <Column sortable field="meterCategory" header="meterCategory"></Column>
         
            <Column field="customerName" header="customerName" filterMatchMode="contains" sortable>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>

        </DataTable>
        <div v-if="errors" class="text-danger">Error loading data: {{errors}}</div>
	</div>
</template>
