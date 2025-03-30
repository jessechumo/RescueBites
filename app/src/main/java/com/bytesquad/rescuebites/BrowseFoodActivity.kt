package com.bytesquad.rescuebites

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.firebase.firestore.FirebaseFirestore

class BrowseFoodActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var foodList: ArrayList<FoodItem>
    private lateinit var adapter: FoodListingAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_browse_food)

        recyclerView = findViewById(R.id.foodRecyclerView)
        recyclerView.layoutManager = LinearLayoutManager(this)
        foodList = ArrayList()
        adapter = FoodListingAdapter(foodList)
        recyclerView.adapter = adapter

        fetchFoodListings()
    }

    private fun fetchFoodListings() {
        FirebaseFirestore.getInstance().collection("foodItems")
            .get()
            .addOnSuccessListener { documents ->
                foodList.clear()
                for (document in documents) {
                    val foodItem = document.toObject(FoodItem::class.java)
                    foodList.add(foodItem)
                }
                adapter.notifyDataSetChanged()
            }
    }
}
