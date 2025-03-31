package com.bytesquad.rescuebites

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.bytesquad.rescuebites.databinding.ActivityBrowseFoodBinding
import com.bytesquad.rescuebites.databinding.ItemFoodListingBinding
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore

class BrowseFoodActivity : AppCompatActivity() {

    private lateinit var binding: ActivityBrowseFoodBinding
    private lateinit var db: FirebaseFirestore
    private val foodList = mutableListOf<FoodItem>()
    private val filteredList = mutableListOf<FoodItem>()
    private var userRole: String = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityBrowseFoodBinding.inflate(layoutInflater)
        setContentView(binding.root)

        db = FirebaseFirestore.getInstance()

        val uid = FirebaseAuth.getInstance().currentUser?.uid
        if (uid == null) {
            Toast.makeText(this, "User not authenticated", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        db.collection("users").document(uid).get()
            .addOnSuccessListener { document ->
                userRole = document.getString("role") ?: ""
                binding.recyclerView.layoutManager = LinearLayoutManager(this)
                binding.recyclerView.adapter = FoodAdapter(userRole)
                loadAvailableFood()
                setupSearchBar()
            }
            .addOnFailureListener {
                Toast.makeText(this, "Failed to fetch user role", Toast.LENGTH_SHORT).show()
                finish()
            }
    }

    private fun loadAvailableFood() {
        db.collection("foodItems")
            .get()
            .addOnSuccessListener { documents ->
                foodList.clear()
                filteredList.clear()
                for (doc in documents) {
                    val item = FoodItem(
                        id = doc.id,
                        type = doc.getString("type") ?: "",
                        quantity = doc.getLong("quantity")?.toInt() ?: 0,
                        expiryDate = doc.getString("expiryDate") ?: "",
                        pickupLocation = doc.getString("pickupLocation") ?: "",
                        donorId = doc.getString("donorId") ?: "",
                        timeStamp = doc.getTimestamp("timeStamp")?.toDate(),
                        imageUrl = doc.getString("imageUrl")
                            ?: "https://source.unsplash.com/400x200/?food&sig=${(1..1000).random()}"
                    )
                    foodList.add(item)
                }
                filteredList.addAll(foodList)
                binding.recyclerView.adapter?.notifyDataSetChanged()
            }
            .addOnFailureListener {
                Toast.makeText(this, "Failed to load food listings", Toast.LENGTH_SHORT).show()
            }
    }

    private fun setupSearchBar() {
        binding.searchBar.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
            override fun afterTextChanged(s: Editable?) {
                val query = s.toString().trim().lowercase()
                filteredList.clear()
                if (query.isEmpty()) {
                    filteredList.addAll(foodList)
                } else {
                    filteredList.addAll(foodList.filter {
                        it.type.lowercase().contains(query) ||
                                it.pickupLocation.lowercase().contains(query)
                    })
                }
                binding.recyclerView.adapter?.notifyDataSetChanged()
            }
        })
    }

    inner class FoodAdapter(private val role: String) : RecyclerView.Adapter<FoodAdapter.FoodViewHolder>() {

        inner class FoodViewHolder(val itemBinding: ItemFoodListingBinding) :
            RecyclerView.ViewHolder(itemBinding.root)

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): FoodViewHolder {
            val view = ItemFoodListingBinding.inflate(LayoutInflater.from(parent.context), parent, false)
            return FoodViewHolder(view)
        }

        override fun onBindViewHolder(holder: FoodViewHolder, position: Int) {
            val item = filteredList[position]
            holder.itemBinding.foodInfo.text =
                "${item.type} - Qty: ${item.quantity}\nExp: ${item.expiryDate}\nLocation: ${item.pickupLocation}"

            // ✅ Load image with Glide
            Glide.with(holder.itemView.context)
                .load(item.imageUrl)
                .placeholder(android.R.drawable.ic_menu_report_image)
                .error(android.R.drawable.ic_delete)
                .into(holder.itemBinding.foodImage)

            if (role == "Donor") {
                holder.itemBinding.btnEdit.visibility = View.VISIBLE
                holder.itemBinding.btnDelete.visibility = View.VISIBLE
            } else {
                holder.itemBinding.btnEdit.visibility = View.GONE
                holder.itemBinding.btnDelete.visibility = View.GONE
            }
        }

        override fun getItemCount(): Int = filteredList.size
    }
}
