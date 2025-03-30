package com.bytesquad.rescuebites

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bytesquad.rescuebites.databinding.ActivityFoodListingBinding
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore

class FoodListingActivity : AppCompatActivity() {
    private lateinit var binding: ActivityFoodListingBinding
    private lateinit var auth: FirebaseAuth
    private lateinit var db: FirebaseFirestore

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityFoodListingBinding.inflate(layoutInflater)
        setContentView(binding.root)

        auth = FirebaseAuth.getInstance()
        db = FirebaseFirestore.getInstance()

        binding.submitFoodButton.setOnClickListener {
            val foodType = binding.foodTypeEditText.text.toString().trim()
            val quantity = binding.quantityEditText.text.toString().trim().toIntOrNull()
            val expiry = binding.expiryDateEditText.text.toString().trim()
            val location = binding.locationEditText.text.toString().trim()

            if (foodType.isEmpty() || quantity == null || expiry.isEmpty() || location.isEmpty()) {
                Toast.makeText(this, "Please fill all fields correctly", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val food = hashMapOf(
                "donorId" to auth.currentUser?.uid,
                "type" to foodType,
                "quantity" to quantity,
                "expiryDate" to expiry,
                "pickupLocation" to location,
                "timestamp" to System.currentTimeMillis()
            )

            db.collection("foodItems").add(food)
                .addOnSuccessListener {
                    Toast.makeText(this, "Food listed successfully!", Toast.LENGTH_SHORT).show()
                    finish()
                }
                .addOnFailureListener { e ->
                    Toast.makeText(this, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                }
        }
    }
}
