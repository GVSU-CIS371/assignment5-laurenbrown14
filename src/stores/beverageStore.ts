import { defineStore } from "pinia";
import { db, auth, googleProvider } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { signInWithPopup, signOut, type User } from "firebase/auth";
import type {
  BaseBeverageType,
  CreamerType,
  SyrupType,
  BeverageType,
} from "../types/beverage";

import temperatures from "../data/tempretures.json";

export const useBeverageStore = defineStore("BeverageStore", {
  state: () => ({
    temps: temperatures,
    currentTemp: temperatures[0],

    bases: [] as BaseBeverageType[],
    syrups: [] as SyrupType[],
    creamers: [] as CreamerType[],

    user: null as User | null,
    savedBeverages: [] as BeverageType[],
    unsubscribe: null as any,

    currentBase: null as BaseBeverageType | null,
    currentSyrup: null as SyrupType | null,
    currentCreamer: null as CreamerType | null,
    beverageName: "",
    currentBeverage: null as BeverageType | null,
    statusMessage: "",
  }),

  actions: {
    showBeverage(bev: BeverageType) {
      this.currentBeverage = bev;
      this.currentBase = bev.base;
      this.currentSyrup = bev.syrup;
      this.currentCreamer = bev.creamer;
      this.currentTemp = bev.temp;
      this.beverageName = bev.name;
    },

    async init() {
      try {
        const [bSnap, sSnap, cSnap] = await Promise.all([
          getDocs(collection(db, "bases")),
          getDocs(collection(db, "syrups")),
          getDocs(collection(db, "creamers")),
        ]);

        this.bases = bSnap.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as BaseBeverageType,
        );
        this.syrups = sSnap.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as SyrupType,
        );
        this.creamers = cSnap.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() }) as CreamerType,
        );

        if (this.bases.length > 0) this.currentBase = this.bases[0];
        if (this.syrups.length > 0) this.currentSyrup = this.syrups[0];
        if (this.creamers.length > 0) this.currentCreamer = this.creamers[0];
        this.currentTemp = this.temps[0];
      } catch (e) {
        console.error("Initialization failed:", e);
      }
    },

    setUser(user: User | null) {
      this.user = user;

      if (this.unsubscribe) this.unsubscribe();

      if (user) {
        const q = query(
          collection(db, "beverages"),
          where("userId", "==", user.uid),
        );
        this.unsubscribe = onSnapshot(q, (snapshot) => {
          this.savedBeverages = snapshot.docs.map(
            (doc) => ({ id: doc.id, ...doc.data() }) as BeverageType,
          );
          if (this.savedBeverages.length === 0) {
            this.currentBeverage = null;
          }
        });
      } else {
        this.savedBeverages = [];
        this.currentBeverage = null;
      }
    },

    async makeBeverage() {
      if (!this.user) {
        this.statusMessage = "No user logged in, please sign in first.";
        return this.statusMessage;
      }

      if (
        !this.beverageName ||
        !this.currentBase ||
        !this.currentSyrup ||
        !this.currentCreamer
      ) {
        this.statusMessage =
          "Please complete all beverage options and the name before making a beverage.";
        return this.statusMessage;
      }

      try {
        await addDoc(collection(db, "beverages"), {
          userId: this.user.uid,
          name: this.beverageName,
          temp: this.currentTemp,
          base: this.currentBase,
          syrup: this.currentSyrup,
          creamer: this.currentCreamer,
          createdAt: Date.now(),
        });

        this.statusMessage = `Beverage ${this.beverageName} made successfully!`;
        this.beverageName = "";
        return this.statusMessage;
      } catch (e) {
        this.statusMessage = "An error occurred while saving.";
        return this.statusMessage;
      }
    },

    async withGoogle() {
      try {
        await signInWithPopup(auth, googleProvider);
      } catch (error) {
        console.error("Google Sign-In Error:", error);
      }
    },
    async logout() {
      await signOut(auth);
    },
  },
});
