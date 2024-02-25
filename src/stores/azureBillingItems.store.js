import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';

const baseUrl = `${import.meta.env.VITE_API_URL}/azurebillingitems`;

export const useAzureBillingItemsStore = defineStore({
    id: 'azurebillingitems',
    state: () => ({
        azurebillingitems: {}
    }),
    actions: {
        async getAll() {
            this.azurebillingitems = { loading: true };
            fetchWrapper.get(baseUrl)
                .then(azurebillingitems => {
                    this.azurebillingitems = azurebillingitems.data
                })
                .catch(error => this.azurebillingitems = { error })
        }
    }
});
