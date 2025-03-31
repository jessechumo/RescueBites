package com.bytesquad.rescuebites

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import com.bytesquad.rescuebites.databinding.ActivityFoodListingBinding
import com.google.firebase.firestore.FirebaseFirestore

class FoodListingActivity : AppCompatActivity() {

    private lateinit var binding: ActivityFoodListingBinding
    private lateinit var adapter: FoodListingAdapter
    private val db = FirebaseFirestore.getInstance()
    private val foodList = mutableListOf<FoodItem>()
    private val filteredList = mutableListOf<FoodItem>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityFoodListingBinding.inflate(layoutInflater)
        setContentView(binding.root)

        adapter = FoodListingAdapter(filteredList)
        binding.recyclerView.layoutManager = LinearLayoutManager(this)
        binding.recyclerView.adapter = adapter

        loadFoodItems()

        binding.searchEditText.addTextChangedListener(object : TextWatcher {
            override fun afterTextChanged(s: Editable?) {
                filterResults(s.toString())
            }

            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
        })
    }

    private fun loadFoodItems() {
        db.collection("foodItems").get()
            .addOnSuccessListener { result ->
                foodList.clear()
                for (doc in result) {
                    val item = FoodItem(
                        id = doc.id,
                        type = doc.getString("type") ?: "",
                        quantity = doc.getLong("quantity")?.toInt() ?: 0,
                        expiryDate = doc.getString("expiryDate") ?: "",
                        pickupLocation = doc.getString("pickupLocation") ?: "",
                        donorId = doc.getString("donorId") ?: "",
                        timeStamp = doc.getTimestamp("timeStamp")?.toDate(),
                        imageUrl = doc.getString("imageUrl") ?: ""
                    )
                    foodList.add(item)
                }
                filterResults(binding.searchEditText.text.toString())
            }
            .addOnFailureListener {
                Toast.makeText(this, "Failed to load food listings", Toast.LENGTH_SHORT).show()
            }
    }

    private fun filterResults(query: String) {
        val lowerQuery = query.lowercase()
        filteredList.clear()
        filteredList.addAll(
            foodList.filter {
                it.type.lowercase().contains(lowerQuery) || it.pickupLocation.lowercase().contains(lowerQuery)
            }
        )
        adapter.notifyDataSetChanged()
    }
}
