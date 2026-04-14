import { FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Combo } from "@/context/ComboContext";

interface AdminProduct {
  id: string;
  name: string;
  price: number | null;
  image_url: string | null;
  description: string | null;
  offer: string | null;
  rating: number | null;
  category: string | null;
  weight_pricing: Record<string, number> | null;
  best_seller: boolean | null;
}

interface ProductFormState {
  name: string;
  price: string;
  description: string;
  offer: string;
  rating: string;
  category: string;
  best_seller: boolean;
  price_250g: string;
  price_500g: string;
  price_1kg: string;
}

const emptyForm: ProductFormState = {
  name: "",
  price: "",
  description: "",
  offer: "",
  rating: "0",
  category: "others",
  best_seller: false,
  price_250g: "",
  price_500g: "",
  price_1kg: "",
};

interface ComboFormState {
  name: string;
  description: string;
  selectedProductIds: string[];
  original_price: string;
  combo_price: string;
  offer: string;
}

const emptyComboForm: ComboFormState = {
  name: "",
  description: "",
  selectedProductIds: [],
  original_price: "",
  combo_price: "",
  offer: "",
};

const Admin = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [imageUploading, setImageUploading] = useState(false);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [comboForm, setComboForm] = useState<ComboFormState>(emptyComboForm);
  const [comboEditingId, setComboEditingId] = useState<string | null>(null);
  const [comboError, setComboError] = useState("");

  const [passwordInput, setPasswordInput] = useState("");
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const adminPassword = useMemo(() => import.meta.env.VITE_ADMIN_PASSWORD || "admin123", []);

  const loadProducts = async () => {
    setLoading(true);
    setError("");
    console.log("[Admin] Loading products...");

    const { data, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .order("name", { ascending: true });

    if (fetchError) {
      console.error("[Admin] Failed to load products:", fetchError.message);
      setError(fetchError.message);
      setLoading(false);
      return;
    }

    const rows = (data || []) as AdminProduct[];
    console.log(`[Admin] Loaded products: ${rows.length}`);
    setProducts(rows);
    setLoading(false);
  };

  const loadCombos = async () => {
    setComboError("");
    console.log("[Admin] Loading combos...");
    const { data, error: fetchError } = await supabase
      .from("combos")
      .select("*")
      .order("name", { ascending: true });

    if (fetchError) {
      console.error("[Admin] Failed to load combos:", fetchError.message);
      setComboError(fetchError.message);
      return;
    }

    const rows = (data || []) as Combo[];
    console.log(`[Admin] Loaded combos: ${rows.length}`);
    setCombos(rows);
  };

  useEffect(() => {
    if (isAdminUnlocked) {
      void loadProducts();
      void loadCombos();
    }
  }, [isAdminUnlocked]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setUploadedImageUrl("");
    setPreviewUrl("");
  };

  const resetComboForm = () => {
    setComboForm(emptyComboForm);
    setComboEditingId(null);
  };

  const handleImageSelect = async (file: File | null) => {
    if (!file) return;

    setError("");
    setImageUploading(true);

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      const extension = file.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
      const filePath = `products/${fileName}`;

      console.log("[Admin] Uploading image to storage:", filePath);
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, file, { upsert: false });

      if (uploadError) {
        console.error("[Admin] Image upload failed:", uploadError.message);
        setError(uploadError.message);
        setImageUploading(false);
        return;
      }

      const { data } = supabase.storage.from("products").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;
      console.log("[Admin] Image uploaded. Public URL created.");
      setUploadedImageUrl(publicUrl);
    } catch {
      setError("Failed to upload image.");
      console.error("[Admin] Unexpected error during image upload.");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const weightPricing: Record<string, number> = {};
    if (form.price_250g) weightPricing["250g"] = Number(form.price_250g);
    if (form.price_500g) weightPricing["500g"] = Number(form.price_500g);
    if (form.price_1kg) weightPricing["1kg"] = Number(form.price_1kg);

    if (
      Object.values(weightPricing).some((value) => Number.isNaN(value) || value < 0)
    ) {
      setError("Weight prices must be valid positive numbers.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      price: form.price ? Number(form.price) : null,
      image_url: uploadedImageUrl || null,
      description: form.description.trim() || null,
      offer: form.offer.trim() || null,
      rating: form.rating ? Number(form.rating) : 0,
      category: form.category || "others",
      best_seller: Boolean(form.best_seller),
      weight_pricing: Object.keys(weightPricing).length > 0 ? weightPricing : null,
    };

    if (!payload.name) {
      setError("Product name is required.");
      return;
    }

    setLoading(true);

    if (editingId) {
      console.log("[Admin] Updating product:", editingId);
      const { error: updateError } = await supabase
        .from("products")
        .update(payload)
        .eq("id", editingId);

      if (updateError) {
        console.error("[Admin] Update failed:", updateError.message);
        setError(updateError.message);
        setLoading(false);
        return;
      }
    } else {
      console.log("[Admin] Creating product...");
      const { error: insertError } = await supabase.from("products").insert(payload);
      if (insertError) {
        console.error("[Admin] Create failed:", insertError.message);
        setError(insertError.message);
        setLoading(false);
        return;
      }
    }

    resetForm();
    await loadProducts();
  };

  const handleDelete = async (id: string) => {
    setError("");
    setLoading(true);
    console.log("[Admin] Deleting product:", id);

    const { error: deleteError } = await supabase.from("products").delete().eq("id", id);
    if (deleteError) {
      console.error("[Admin] Delete failed:", deleteError.message);
      setError(deleteError.message);
      setLoading(false);
      return;
    }

    await loadProducts();
  };

  const handleComboSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setComboError("");

    if (!comboForm.name.trim()) {
      setComboError("Combo name is required.");
      return;
    }
    if (comboForm.selectedProductIds.length === 0) {
      setComboError("Select at least one product.");
      return;
    }

    const payload = {
      name: comboForm.name.trim(),
      description: comboForm.description.trim() || null,
      items: comboForm.selectedProductIds,
      original_price: comboForm.original_price ? Number(comboForm.original_price) : 0,
      combo_price: comboForm.combo_price ? Number(comboForm.combo_price) : 0,
      offer: comboForm.offer.trim() || null,
    };

    if (comboEditingId) {
      console.log("[Admin] Updating combo:", comboEditingId);
      const { error: updateError } = await supabase
        .from("combos")
        .update(payload)
        .eq("id", comboEditingId);
      if (updateError) {
        setComboError(updateError.message);
        return;
      }
    } else {
      console.log("[Admin] Creating combo...");
      const { error: insertError } = await supabase.from("combos").insert(payload);
      if (insertError) {
        setComboError(insertError.message);
        return;
      }
    }

    resetComboForm();
    await loadCombos();
  };

  const handleComboEdit = (combo: Combo) => {
    setComboEditingId(combo.id);
    setComboForm({
      name: combo.name || "",
      description: combo.description || "",
      selectedProductIds: Array.isArray(combo.items) ? combo.items : [],
      original_price: combo.original_price?.toString() || "",
      combo_price: combo.combo_price?.toString() || "",
      offer: combo.offer || "",
    });
  };

  const handleComboDelete = async (id: string) => {
    setComboError("");
    console.log("[Admin] Deleting combo:", id);
    const { error: deleteError } = await supabase.from("combos").delete().eq("id", id);
    if (deleteError) {
      setComboError(deleteError.message);
      return;
    }
    await loadCombos();
  };

  const handleEdit = (product: AdminProduct) => {
    setEditingId(product.id);
    setForm({
      name: product.name || "",
      price: product.price?.toString() || "",
      description: product.description || "",
      offer: product.offer || "",
      rating: product.rating?.toString() || "0",
      category: product.category || "others",
      best_seller: Boolean(product.best_seller),
      price_250g: product.weight_pricing?.["250g"]?.toString() || "",
      price_500g: product.weight_pricing?.["500g"]?.toString() || "",
      price_1kg: product.weight_pricing?.["1kg"]?.toString() || "",
    });
    setUploadedImageUrl(product.image_url || "");
    setPreviewUrl(product.image_url || "");
  };

  if (!isAdminUnlocked) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="mx-auto mt-20 max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
          <h1 className="font-display text-2xl font-bold text-card-foreground">Admin Access</h1>
          <p className="mt-2 font-body text-sm text-muted-foreground">
            Enter admin password to continue.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (passwordInput === adminPassword) {
                setIsAdminUnlocked(true);
                setError("");
                console.log("[Admin] Access granted.");
              } else {
                setError("Invalid admin password.");
                console.error("[Admin] Invalid password.");
              }
            }}
            className="mt-4 space-y-3"
          >
            <input
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Admin password"
              className="w-full rounded-md border border-input bg-background px-3 py-2 font-body text-sm text-foreground"
            />
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2 font-body text-sm font-semibold text-primary-foreground hover:bg-maroon-light"
            >
              Unlock Admin
            </button>
          </form>
          {error && <p className="mt-3 font-body text-sm text-destructive">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <h1 className="font-display text-3xl font-bold text-foreground">Admin Panel</h1>

        <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="font-display text-xl font-semibold text-card-foreground">
            {editingId ? "Update Product" : "Add Product"}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Name"
              className="rounded-md border border-input bg-background px-3 py-2 font-body text-sm"
            />
            <input
              value={form.price}
              onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
              placeholder="Price"
              type="number"
              className="rounded-md border border-input bg-background px-3 py-2 font-body text-sm"
            />
            <div className="md:col-span-2">
              <label className="mb-1 block font-body text-sm font-medium text-card-foreground">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => void handleImageSelect(e.target.files?.[0] || null)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 font-body text-sm"
              />
              {imageUploading && (
                <p className="mt-2 font-body text-xs text-muted-foreground">Uploading image...</p>
              )}
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Selected preview"
                  className="mt-3 h-24 w-24 rounded-md border border-border object-cover"
                />
              )}
            </div>
            <input
              value={form.offer}
              onChange={(e) => setForm((prev) => ({ ...prev, offer: e.target.value }))}
              placeholder="Offer"
              className="rounded-md border border-input bg-background px-3 py-2 font-body text-sm md:col-span-2"
            />
            <input
              value={form.rating}
              onChange={(e) => setForm((prev) => ({ ...prev, rating: e.target.value }))}
              placeholder="Rating (0 to 5)"
              type="number"
              min={0}
              max={5}
              step="0.1"
              className="rounded-md border border-input bg-background px-3 py-2 font-body text-sm"
            />
            <select
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              className="rounded-md border border-input bg-background px-3 py-2 font-body text-sm"
            >
              <option value="pickles">Pickles</option>
              <option value="snacks">Snacks</option>
              <option value="others">Others</option>
            </select>
            <label className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 font-body text-sm md:col-span-2">
              <input
                type="checkbox"
                checked={form.best_seller}
                onChange={(e) => setForm((prev) => ({ ...prev, best_seller: e.target.checked }))}
              />
              <span>Mark as Best Seller</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Description"
              rows={3}
              className="rounded-md border border-input bg-background px-3 py-2 font-body text-sm md:col-span-2"
            />
            <input
              value={form.price_250g}
              onChange={(e) => setForm((prev) => ({ ...prev, price_250g: e.target.value }))}
              placeholder="Price for 250g"
              type="number"
              className="rounded-md border border-input bg-background px-3 py-2 font-body text-sm"
            />
            <input
              value={form.price_500g}
              onChange={(e) => setForm((prev) => ({ ...prev, price_500g: e.target.value }))}
              placeholder="Price for 500g"
              type="number"
              className="rounded-md border border-input bg-background px-3 py-2 font-body text-sm"
            />
            <input
              value={form.price_1kg}
              onChange={(e) => setForm((prev) => ({ ...prev, price_1kg: e.target.value }))}
              placeholder="Price for 1kg"
              type="number"
              className="rounded-md border border-input bg-background px-3 py-2 font-body text-sm md:col-span-2"
            />
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-primary px-4 py-2 font-body text-sm font-semibold text-primary-foreground hover:bg-maroon-light disabled:opacity-60"
            >
              {editingId ? "Update Product" : "Add Product"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-md border border-border px-4 py-2 font-body text-sm text-foreground"
              >
                Cancel Edit
              </button>
            )}
          </div>

          {error && <p className="mt-3 font-body text-sm text-destructive">{error}</p>}
        </form>

        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-card-foreground">All Products</h2>
            <button
              onClick={() => void loadProducts()}
              className="rounded-md border border-border px-3 py-1.5 font-body text-sm"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="font-body text-sm text-muted-foreground">Loading...</p>
          ) : products.length === 0 ? (
            <p className="font-body text-sm text-muted-foreground">No products found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-left font-body text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Price</th>
                    <th className="py-2 pr-4">Image</th>
                    <th className="py-2 pr-4">Offer</th>
                    <th className="py-2 pr-4">Rating</th>
                    <th className="py-2 pr-4">Category</th>
                    <th className="py-2 pr-4">Best Seller</th>
                    <th className="py-2 pr-4">Weight Pricing</th>
                    <th className="py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-border/60">
                      <td className="py-2 pr-4 font-medium text-card-foreground">{product.name}</td>
                      <td className="py-2 pr-4">₹{product.price ?? "-"}</td>
                      <td className="max-w-[220px] truncate py-2 pr-4 text-xs text-muted-foreground">
                        {product.image_url || "-"}
                      </td>
                      <td className="py-2 pr-4">{product.offer || "-"}</td>
                      <td className="py-2 pr-4">{product.rating ?? 0}</td>
                      <td className="py-2 pr-4">{product.category || "others"}</td>
                      <td className="py-2 pr-4">{product.best_seller ? "Yes" : "No"}</td>
                      <td className="max-w-[260px] truncate py-2 pr-4 font-mono text-xs text-muted-foreground">
                        {product.weight_pricing ? JSON.stringify(product.weight_pricing) : "-"}
                      </td>
                      <td className="py-2 pr-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="rounded-md border border-border px-3 py-1 text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => void handleDelete(product.id)}
                            className="rounded-md bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
          <h2 className="font-display text-xl font-semibold text-card-foreground">Manage Combos</h2>
          <form onSubmit={handleComboSubmit} className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <input
              value={comboForm.name}
              onChange={(e) => setComboForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Combo Name"
              className="rounded-md border border-input bg-background px-3 py-2 font-body text-sm"
            />
            <input
              value={comboForm.offer}
              onChange={(e) => setComboForm((prev) => ({ ...prev, offer: e.target.value }))}
              placeholder="Offer Text"
              className="rounded-md border border-input bg-background px-3 py-2 font-body text-sm"
            />
            <textarea
              value={comboForm.description}
              onChange={(e) => setComboForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Combo Description"
              rows={3}
              className="rounded-md border border-input bg-background px-3 py-2 font-body text-sm md:col-span-2"
            />
            <div className="rounded-md border border-input bg-background px-3 py-2 md:col-span-2">
              <p className="mb-2 font-body text-sm font-medium text-card-foreground">Select Products</p>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {products.map((product) => {
                  const checked = comboForm.selectedProductIds.includes(product.id);
                  return (
                    <label key={product.id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          setComboForm((prev) => ({
                            ...prev,
                            selectedProductIds: e.target.checked
                              ? [...prev.selectedProductIds, product.id]
                              : prev.selectedProductIds.filter((id) => id !== product.id),
                          }));
                        }}
                      />
                      <span>{product.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <input
              value={comboForm.original_price}
              onChange={(e) => setComboForm((prev) => ({ ...prev, original_price: e.target.value }))}
              placeholder="Original Price"
              type="number"
              className="rounded-md border border-input bg-background px-3 py-2 font-body text-sm"
            />
            <input
              value={comboForm.combo_price}
              onChange={(e) => setComboForm((prev) => ({ ...prev, combo_price: e.target.value }))}
              placeholder="Combo Price"
              type="number"
              className="rounded-md border border-input bg-background px-3 py-2 font-body text-sm"
            />
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="rounded-md bg-primary px-4 py-2 font-body text-sm font-semibold text-primary-foreground hover:bg-maroon-light"
              >
                {comboEditingId ? "Update Combo" : "Add Combo"}
              </button>
              {comboEditingId && (
                <button
                  type="button"
                  onClick={resetComboForm}
                  className="rounded-md border border-border px-4 py-2 font-body text-sm text-foreground"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
          {comboError && <p className="mt-3 font-body text-sm text-destructive">{comboError}</p>}

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left font-body text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Items</th>
                  <th className="py-2 pr-4">Original</th>
                  <th className="py-2 pr-4">Combo</th>
                  <th className="py-2 pr-4">Offer</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {combos.map((combo) => (
                  <tr key={combo.id} className="border-b border-border/60">
                    <td className="py-2 pr-4 font-medium text-card-foreground">{combo.name}</td>
                    <td className="py-2 pr-4 text-xs text-muted-foreground">
                      {Array.isArray(combo.items) ? combo.items.join(", ") : "-"}
                    </td>
                    <td className="py-2 pr-4">₹{combo.original_price ?? 0}</td>
                    <td className="py-2 pr-4">₹{combo.combo_price ?? 0}</td>
                    <td className="py-2 pr-4">{combo.offer || "-"}</td>
                    <td className="py-2 pr-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleComboEdit(combo)}
                          className="rounded-md border border-border px-3 py-1 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => void handleComboDelete(combo.id)}
                          className="rounded-md bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
