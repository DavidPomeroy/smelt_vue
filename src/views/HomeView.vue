<script setup>

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import { ref, onMounted } from 'vue';
import { fetchWrapper } from '@/helpers';
import moment from 'moment';
import { FilterMatchMode } from 'primevue/api';

const baseUrl = `${import.meta.env.VITE_API_URL}/azurebillingitems`;



onMounted(() => {
    loading.value = true;

    lazyParams.value = {
    "pagination":{
        "page_size":50,
        "page":1
    },
    "columns":[

    ],
    "filters":[
            
    ],
    "sorting":[
       
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

const filters=ref();
const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        service: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        customerId: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        customerName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        billingDate: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        subscriptionId: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        subscriptionName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        resourceGroup: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        resourceName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        meterCategory: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        meterSubCategory: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        meterId: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        meterName: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        units: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        billedQuantity: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        unitPrice: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        price: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO },
        billingYear: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        billingMonth: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
       
    };

};

initFilters();


const lazyParams = ref({});

function format_date(value) {
        if (value) {
            return moment(String(value)).format('DD-MM-YYYY')
        }
    }

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
    let t_filters=[];

    console.log('table filters')
    console.log(filters.value);

    Object.entries(filters.value)
    .forEach(([key, value]) => {
        let comparator='';
        switch (value.matchMode) {
                case 'contains':
                    comparator='contains';
                    break;
                case 'notContains':
                    comparator='!contains';
                    break;
                case 'startsWith':
                    comparator='begins';
                    break;
                case 'endsWith':
                    comparator='ends';
                    break;
                case 'equals':
                    comparator='=';
                    break;
                case 'notEquals':
                    comparator='!=';
                    break;
                case 'lt':
                    comparator='<';
                    break;
                case 'gt':
                    comparator='>';
                    break;
                case 'lte':
                    comparator='<=';
                    break;
                case 'gte':
                    comparator='>=';
                    break;
                
        }

        if(typeof value.value !='undefined' && value.value ){
            t_filters.push({ "column":key,
            "comparator":comparator,
            "value":value.value});
        }   
    });
    lazyParams.value.filters = t_filters;
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
        <DataTable stripedRows :value="rows" lazy paginator :first="page" :rows="50" :rowsPerPageOptions="[5, 10, 20, 50]" v-model:filters="filters" ref="dt" dataKey="id"
            :totalRecords="totalRecords" :loading="loading" @page="onPage($event)" @sort="onSort($event)" @filter="onFilter($event)" filterDisplay="menu"
            :globalFilterFields="['service','customerId', 'customerName','billingDate','subscriptionId','subscriptionName','resourceGroup','resourceName', 'meterCategory','meterSubCategory','meterId','meterName','units','billedQuantity','unitPrice','price','billingYear','billingMonth']"
            v-model:selection="selectedRows" :selectAll="selectAll" @select-all-change="onSelectAllChange" @row-select="onRowSelect" @row-unselect="onRowUnselect" tableStyle="min-width: 75rem">
            <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
            <Column field="service" header="service" filterMatchMode="startsWith" sortable>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>
            <Column field="customerId" header="customerId" filterMatchMode="startsWith" sortable>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>
           
            <Column field="customerName" header="customerName" filterMatchMode="contains" sortable>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>
            <Column field="billingDate" header="billingDate" filterMatchMode="contains" sortable>
                <template #body="slotProps">
            {{ format_date(slotProps.data.billingDate) }}
        </template>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>
            <Column field="subscriptionId" header="subscriptionId" filterMatchMode="contains" sortable>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>
            <Column field="subscriptionName" header="subscriptionName" filterMatchMode="contains" sortable>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>
            <Column field="resourceName" header="resourceName" filterMatchMode="contains" sortable>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>
            <Column field="resourceGroup" header="resourceGroup" filterMatchMode="contains" sortable>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>
            <Column field="meterCategory" header="meterCategory" filterMatchMode="contains" sortable>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>
            <Column field="meterSubCategory" header="meterSubCategory" filterMatchMode="contains" sortable>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>
            <Column field="meterId" header="meterId" filterMatchMode="contains" sortable>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>
            <Column field="meterName" header="meterName" filterMatchMode="contains" sortable>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>
            <Column field="units" header="units" filterMatchMode="contains" sortable>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>
            <Column field="billedQuantity" header="billedQuantity" filterMatchMode="contains" sortable>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>
            <Column field="unitPrice" header="unitPrice"  filterMatchMode="contains" sortable>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>
            <Column field="price" header="price" dataType="numeric" filterMatchMode="contains" sortable>
                <template #filter="{filterModel,filterCallback}">
                    <InputNumber v-model="filterModel.value" mode="currency" currency="GBP" locale="en-GB" @keydown.enter="filterCallback()" />

                    <!-- <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/> -->
                </template>

            </Column>
            <Column field="billingYear" header="billingYear" filterMatchMode="contains" sortable>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>
            <Column field="billingMonth" header="billingMonth" filterMatchMode="contains" sortable>
                <template #filter="{filterModel,filterCallback}">
                    <InputText type="text" v-model="filterModel.value" @keydown.enter="filterCallback()" class="p-column-filter" placeholder="Search"/>
                </template>
            </Column>
        </DataTable>
        <div v-if="errors" class="text-danger">Error loading data: {{errors}}</div>
	</div>
</template>
