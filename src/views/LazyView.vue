<script setup>
import { ref, onMounted } from 'vue';
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
const customers = ref();
const selectedCustomers = ref();
const selectAll = ref(false);
const page = ref(0);
const filters = ref({
    'name': {value: '', matchMode: 'contains'},
    'country.name': {value: '', matchMode: 'contains'},
    'company': {value: '', matchMode: 'contains'},
    'representative.name': {value: '', matchMode: 'contains'},
});
const lazyParams = ref({});
// const columns = ref([
//     {field: 'name', header: 'Name'},
//     {field: 'country.name', header: 'Country'},
//     {field: 'company', header: 'Company'},
//     {field: 'representative.name', header: 'Representative'}
// ]);

const loadLazyData = (event) => {
    loading.value = true;
    lazyParams.value = { ...lazyParams.value, page: event?.page || page.value };

    setTimeout(() => {
        // CustomerService.getCustomers({ lazyEvent: JSON.stringify(lazyParams.value) }).then((data) => {
        //     customers.value = data.customers;
        //     totalRecords.value = data.totalRecords;
        //     loading.value = false;
        // });
    }, Math.random() * 1000 + 250);
};
const onPage = (event) => {
    lazyParams.value = event;
    loadLazyData(event);
};
const onSort = (event) => {
    lazyParams.value = event;
    loadLazyData(event);
};
const onFilter = (event) => {
    lazyParams.value.filters = filters.value ;
    loadLazyData(event);
};
const onSelectAllChange = (event) => {
    selectAll.value = event.checked;

    if (selectAll.value) {
        // CustomerService.getCustomers().then(data => {
        //     selectAll.value = true;
        //     selectedCustomers.value = data.customers;
        // });
    }
    else {
        selectAll.value = false;
        selectedCustomers.value = [];
    }
};
const onRowSelect = () => {
    selectAll.value = selectedCustomers.value.length === totalRecords.value;
};
const onRowUnselect = () => {
    selectAll.value = false;
};

</script>

<template>
	<div class="card p-fluid">
        <DataTable :value="customers" lazy paginator :first="page" :rows="10" v-model:filters="filters" ref="dt" dataKey="id"
            :totalRecords="totalRecords" :loading="loading" @page="onPage($event)" @sort="onSort($event)" @filter="onFilter($event)" filterDisplay="row"
            :globalFilterFields="['name','country.name', 'company', 'representative.name']"
            v-model:selection="selectedCustomers" :selectAll="selectAll" @select-all-change="onSelectAllChange" @row-select="onRowSelect" @row-unselect="onRowUnselect" tableStyle="min-width: 75rem">
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column field="name" header="Name" filterMatchMode="startsWith" sortable>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>
            <Column field="country.name" header="Country" filterField="country.name" filterMatchMode="contains" sortable>
                <template #body="{ data }">
                    <div class="flex align-items-center gap-2">
                        <img alt="flag" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`flag flag-${data.country.code}`" style="width: 24px" />
                        <span>{{ data.country.name }}</span>
                    </div>
                </template>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>
            <Column field="company" header="Company" filterMatchMode="contains" sortable>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>
            <Column field="representative.name" header="Representative" filterField="representative.name" sortable>
                <template #body="{ data }">
                    <div class="flex align-items-center gap-2">
                        <img :alt="data.representative.name" :src="`https://primefaces.org/cdn/primevue/images/avatar/${data.representative.image}`" style="width: 32px" />
                        <span>{{ data.representative.name }}</span>
                    </div>
                </template>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>
        </DataTable>
	</div>
</template>
