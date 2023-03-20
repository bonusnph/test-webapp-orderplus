<template>
  <v-layout>
    <v-app-bar color="primary" prominent>
      <v-toolbar-title>OrderPlus</v-toolbar-title>

      <v-spacer></v-spacer>

      <div class="d-flex justify-end mb-3">
        <v-btn @click="logout" class="mx-3"
          ><v-icon>mdi-logout</v-icon> Logout</v-btn
        >
      </div>
    </v-app-bar>

    <v-main>
      <v-card>
        <v-card-title>Products</v-card-title>
        <v-card-text>
          <div class="d-flex justify-end mb-3">
            <v-btn color="success" @click="showAddDialog">เพิ่มสินค้า</v-btn>
          </div>
          <div class="d-flex justify-end">
            <v-text-field
              v-model="keyword"
              label="คำค้นหา"
              @input="search"
            ></v-text-field>
          </div>
          <v-table>
            <thead>
              <tr>
                <th class="text-left">รหัสสินค้า</th>
                <th class="text-left">ชื่อสินค้า</th>
                <th class="text-right">ราคา</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td>{{ product.id }}</td>
                <td>{{ product.name }}</td>
                <td class="text-right">{{ product.price.toFixed(2) }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
      <v-dialog
        v-model="addProductDialog"
        persistent
        width="90%"
        max-width="600px"
      >
        <v-card>
          <v-card-title>เพิ่มสินค้า</v-card-title>
          <v-card-item>
            <v-text-field
              v-model="addProductId"
              label="รหัสสินค้า"
              :error="isAddClicked && !addProductId"
            ></v-text-field>
            <v-text-field
              v-model="addProductName"
              label="ชื่อสินค้า"
              :error="isAddClicked && !addProductName"
            ></v-text-field>
            <v-text-field
              v-model="addProductPrice"
              type="number"
              label="ราคา"
              :error="isAddClicked && !addProductPrice"
            ></v-text-field>
            <div class="d-flex justify-center mb-3">
              <v-btn color="success" class="mr-1" @click="add">เพิ่ม</v-btn>
              <v-btn @click="closeAddDialog">ยกเลิก</v-btn>
            </div>
          </v-card-item>
        </v-card>
      </v-dialog>
    </v-main>
  </v-layout>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import { useAppStore } from "@/store/app";

export default {
  setup(props, { root }) {
    const store = useAppStore();
    const keyword = ref();
    const addProductDialog = ref(false);
    const addProductId = ref();
    const addProductName = ref();
    const addProductPrice = ref();
    const isAddClicked = ref(false);

    const loadProducts = async () => {
      await store.getProducts(keyword.value);
    };

    const closeAddDialog = () => {
      addProductId.value = null;
      addProductName.value = null;
      addProductPrice.value = null;
      addProductDialog.value = false;
    };

    onMounted(async () => {
      await loadProducts();
    });

    watch(keyword, async () => {
      await loadProducts();
    });

    return {
      products: computed(() => store.products),
      keyword,
      addProductDialog,
      addProductId,
      addProductName,
      addProductPrice,
      isAddClicked,
      async add() {
        try {
          isAddClicked.value = true;

          await store.addProduct({
            id: addProductId.value,
            name: addProductName.value,
            price: Number(addProductPrice.value),
          });

          await loadProducts();
          closeAddDialog();
        } catch (err) {}
      },
      showAddDialog() {
        isAddClicked.value = false;
        addProductDialog.value = true;
      },
      closeAddDialog,
      logout(e) {
        store.logout();
        e.preventDefault();
      },
    };
  },
};
</script>

<style>
</style>