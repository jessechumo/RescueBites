package com.bytesquad.rescuebites

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.ViewGroup
import android.widget.Toast
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.bytesquad.rescuebites.databinding.ActivityManageListingsBinding
import com.bytesquad.rescuebites.databinding.ItemFoodListingBinding
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore

class ManageListingsActivity : AppCompatActivity() {
    private lateinit var binding: ActivityManageListingsBinding
    private lateinit var db: FirebaseFirestore
    private lateinit var auth: FirebaseAuth
    private val listings = mutableListOf<FoodItem>()

    private lateinit var editListingLauncher: ActivityResultLauncher<Intent>

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityManageListingsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        db = FirebaseFirestore.getInstance()
        auth = FirebaseAuth.getInstance()

        val adapter = ListingAdapter()
        binding.recyclerView.layoutManager = LinearLayoutManager(this)
        binding.recyclerView.adapter = adapter

        editListingLauncher = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            if (result.resultCode == RESULT_OK) {
                loadListings() // Refresh listings when returning
            }
        }

        loadListings()
    }

    private fun loadListings() {
        listings.clear()
        val uid = auth.currentUser?.uid ?: return
        db.collection("foodItems")
            .whereEqualTo("donorId", uid)
            .get()
            .addOnSuccessListener { docs ->
                for (doc in docs) {
                    val item = FoodItem(
                        id = doc.id,
                        type = doc.getString("type") ?: "",
                        quantity = doc.getLong("quantity")?.toInt() ?: 0,
                        expiryDate = doc.getString("expiryDate") ?: "",
                        pickupLocation = doc.getString("pickupLocation") ?: "",
                        donorId = doc.getString("donorId") ?: "",
                        timeStamp = doc.getString("timeStamp") ?: ""
                    )
                    listings.add(item)
                }
                binding.recyclerView.adapter?.notifyDataSetChanged()
            }
            .addOnFailureListener {
                Toast.makeText(this, "Failed to load listings", Toast.LENGTH_SHORT).show()
            }
    }

    inner class ListingAdapter : RecyclerView.Adapter<ListingAdapter.FoodViewHolder>() {
        inner class FoodViewHolder(val itemBinding: ItemFoodListingBinding) :
            RecyclerView.ViewHolder(itemBinding.root)

        override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): FoodViewHolder {
            val view = ItemFoodListingBinding.inflate(LayoutInflater.from(parent.context), parent, false)
            return FoodViewHolder(view)
        }

        override fun onBindViewHolder(holder: FoodViewHolder, position: Int) {
            val item = listings[position]
            holder.itemBinding.foodInfo.text = "${item.type} - Qty: ${item.quantity}\nExp: ${item.expiryDate}\nLocation: ${item.pickupLocation}"

            holder.itemBinding.btnDelete.setOnClickListener {
                db.collection("foodItems").document(item.id)
                    .delete()
                    .addOnSuccessListener {
                        Toast.makeText(this@ManageListingsActivity, "Deleted!", Toast.LENGTH_SHORT).show()
                        listings.removeAt(position)
                        notifyItemRemoved(position)
                    }
                    .addOnFailureListener {
                        Toast.makeText(this@ManageListingsActivity, "Delete failed", Toast.LENGTH_SHORT).show()
                    }
            }

            holder.itemBinding.btnEdit.setOnClickListener {
                val intent = Intent(this@ManageListingsActivity, EditListingActivity::class.java).apply {
                    putExtra("id", item.id)
                    putExtra("type", item.type)
                    putExtra("quantity", item.quantity)
                    putExtra("expiry", item.expiryDate)
                    putExtra("location", item.pickupLocation)
                }
                editListingLauncher.launch(intent)
            }
        }

        override fun getItemCount(): Int = listings.size
    }
}
