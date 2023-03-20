// Utilities
import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import router from "@/router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import {
  getAuth,
  // createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  onValue,
  set,
  query,
  startAt,
  endAt,
  equalTo,
  orderByChild,
} from "firebase/database";
import { app } from "../plugins/firebase";

export const useAppStore = defineStore("app", {
  state: () => ({ _user: useStorage("user", null), _products: [] }),
  getters: {
    user: (state) => state._user,
    products: (state) => state._products,
  },
  actions: {
    async login({ email, password }) {
      try {
        const userImpl = await signInWithEmailAndPassword(
          getAuth(),
          email,
          password
        );
        this._user = userImpl.user;
        toast.success("successfully logged in.", {
          autoClose: 1000,
        });
        router.push({ name: "home" });
      } catch (err) {
        toast.error(err.message, {
          autoClose: 3000,
        });
      }
    },
    async logout() {
      await signOut(getAuth());
      this._user = null;
      toast.success("successfully logged out.", {
        autoClose: 1000,
      });
      router.push({ name: "login" });
    },
    async addProduct({ id, name, price }) {
      try {
        //#region validator
        const err = [];
        if (!id) err.push("id");
        if (!name) err.push("name");
        if (!price || isNaN(Number(price))) err.push("price");

        if (err.length > 0) {
          throw new Error(err.toString() + " required.");
        }

        if (price && (isNaN(price) || Number(price) < 0)) {
          throw new Error("price's format is invalid");
        }

        if (id && (await this.getProductById(id))) {
          throw new Error(`id := ${id} is exists.`);
        }
        //#endregion

        const db = getDatabase(app);
        await set(ref(db, "products/" + id), {
          id,
          name,
          price,
        });

        toast.success(`product#${id} was added.`, {
          autoClose: 1000,
        });
      } catch (error) {
        toast.error(error.message, {
          autoClose: 3000,
        });
        throw new Error(error.message);
      }
    },
    async getProducts(keyword = "") {
      const db = getDatabase(app);
      const dbRef = ref(db, "products");

      // const queryArray = [];
      // if (keyword) {
      //   queryArray.push(
      //     orderByChild("id"),
      //     equalTo(Number(keyword))
      //   );
      // }

      // const queryRef = query(
      //   dbRef,
      //   ...queryArray
      //   // startAt(keyword),
      //   // endAt(keyword + "\uf8ff"),
      //   // startAt(keyword),
      //   // endAt(keyword + "\uf8ff")
      // );

      return new Promise((resolve, reject) => {
        onValue(
          dbRef,
          (snapshot) => {
            const data = snapshot.val();
            const items =
              data && Array.isArray(data)
                ? data.filter((each) => each)
                : data ?? [];

            // client filter
            const itemsFiltered = items.filter(
              (each) =>
                each.id == keyword ||
                each.name.toLowerCase().includes(keyword.toLowerCase())
            );

            this._products = itemsFiltered;
            resolve(itemsFiltered);
          },
          (err) => {
            console.error(err.message);
            reject(err.message);
          },
          {
            onlyOnce: true,
          }
        );
      });
    },
    async getProductById(id) {
      return new Promise((resolve, reject) => {
        const db = getDatabase(app);
        const dbRef = ref(db, "products/" + id);
        onValue(
          dbRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              resolve(data);
            } else {
              resolve(null);
            }
          },
          (err) => {
            console.error(err.message);
            reject(err.message);
          },
          {
            onlyOnce: true,
          }
        );
      });
    },
  },
});
