import { useState, useMemo } from 'react';
import { RESOURCE_ITEMS } from '../data/gameData';

// --- HELPER: Flatten Resource List ---
const ALL_RESOURCE_ITEMS = (() => {
    const list = [];
    Object.values(RESOURCE_ITEMS).forEach(items => list.push(...items));
    return list;
})();

const getResourceInfo = (itemId) => ALL_RESOURCE_ITEMS.find(i => i.id === itemId);

export function useMarketplace(user, listings, myPets, onSell, onSellResource) {
    const [activeTab, setActiveTab] = useState('buy');
    const [subTab, setSubTab] = useState('pets');

    const [sellPrice, setSellPrice] = useState('');
    const [sellQuantity, setSellQuantity] = useState(1);
    const [selectedForSale, setSelectedForSale] = useState(null);
    const [viewingPetDetails, setViewingPetDetails] = useState(null);

    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRarity, setFilterRarity] = useState('ALL');

    // --- FILTER LOGIK ---
    const checkFilters = (item) => {
        if (!item) return false;

        // Für Pets
        if (item.type || item.isEgg) {
            const displayName = item.isEgg ? 'Ei' : item.name;
            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                // Suche auch bei Eiern im verschleierten Namen
                const matchesName = displayName && displayName.toLowerCase().includes(term);
                if (!matchesName) return false;
            }
            if (filterRarity !== 'ALL' && item.rarity !== filterRarity) return false;
        }
        // Für Ressourcen
        else if (item.id) {
            if (searchTerm && !item.label.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        }

        return true;
    };

    // --- LISTEN VORBEREITEN ---

    // 1. BUY LISTE
    const buyList = useMemo(() => {
        return listings
            .filter(l => {
                if (subTab === 'pets') return l.type !== 'RESOURCE' && (!l.type || l.pet);
                if (subTab === 'items') return l.type === 'RESOURCE';
                return false;
            })
            .sort((a, b) => {
                const isMyA = a.sellerId === user.id;
                const isMyB = b.sellerId === user.id;
                if (isMyA && !isMyB) return -1;
                if (!isMyA && isMyB) return 1;
                return b.createdAt - a.createdAt;
            });
    }, [listings, subTab, user.id]);

    // 2. SELL LISTE (PETS)
    const sellPetsList = useMemo(() => {
        const list = [];
        const eggStacks = {};

        myPets.forEach(p => {
            if ((user.team || []).includes(p.id)) return;
            if (!checkFilters(p)) return;

            if (p.isEgg) {
                const stackKey = `${p.rarity}`;
                if (!eggStacks[stackKey]) eggStacks[stackKey] = { ...p, id: `stack-${p.rarity}`, isStack: true, count: 0, pets: [] };
                eggStacks[stackKey].count++;
                eggStacks[stackKey].pets.push(p);
            } else {
                list.push(p);
            }
        });
        return [...list, ...Object.values(eggStacks)];
    }, [myPets, user.team, searchTerm, filterRarity]);

    // 3. SELL LISTE (ITEMS)
    const sellItemsList = useMemo(() => {
        const storage = user.village?.storage || {};
        const list = [];

        Object.entries(storage).forEach(([id, count]) => {
            if (count <= 0) return;
            const info = getResourceInfo(id);
            if (info) {
                list.push({ ...info, count, isResource: true });
            }
        });
        return list;
    }, [user.village]);


    // --- ACTIONS ---
    const handleSellSubmit = () => {
        if (!selectedForSale || !sellPrice || isNaN(sellPrice) || sellPrice <= 0) return;
        const price = parseInt(sellPrice);

        if (selectedForSale.isResource) {
            const qty = Math.max(1, Math.min(sellQuantity, selectedForSale.count));
            const totalPrice = price * qty;
            if (onSellResource) {
                onSellResource(selectedForSale.id, qty, totalPrice);
            }
        } else {
            if (selectedForSale.isStack) {
                const qty = Math.max(1, Math.min(sellQuantity, selectedForSale.count));
                const petsToSell = selectedForSale.pets.slice(0, qty);
                const totalPrice = price * qty;
                onSell(petsToSell, totalPrice);
            } else {
                onSell(selectedForSale, price);
            }
        }

        setSelectedForSale(null);
        setSellPrice('');
        setSellQuantity(1);
    };

    const toggleSaleSelection = (item) => {
        if (selectedForSale?.id === item.id) {
            setSelectedForSale(null); setSellPrice(''); setSellQuantity(1);
        } else {
            setSelectedForSale(item); setSellPrice(''); setSellQuantity(1);
        }
    };

    return {
        activeTab, setActiveTab,
        subTab, setSubTab,
        sellPrice, setSellPrice,
        sellQuantity, setSellQuantity,
        selectedForSale, setSelectedForSale,
        viewingPetDetails, setViewingPetDetails,
        isSidebarOpen, setSidebarOpen,
        searchTerm, setSearchTerm,
        filterRarity, setFilterRarity,
        buyList,
        sellPetsList,
        sellItemsList,
        handleSellSubmit,
        toggleSaleSelection
    };
}
