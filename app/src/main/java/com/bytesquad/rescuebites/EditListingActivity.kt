package com.bytesquad.rescuebites

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.bytesquad.rescuebites.databinding.ActivityEditListingBinding
import com.google.firebase.firestore.FirebaseFirestore

class EditListingActivity : AppCompatActivity() {

    private lateinit var binding: ActivityEditListingBinding
    private lateinit var listingId: String
    private val db = FirebaseFirestore.getInstance()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityEditListingBinding.inflate(layoutInflater)
        setContentView(binding.root)

        listingId = intent.getStringExtra("listingId") ?: ""

        if (listingId.isEmpty()) {
            Toast.makeText(this, "Invalid listing ID", Toast.LENGTH_SHORT).show()
            finish()
            return
        }

        // Load existing listing data
        db.collection("foodItems").document(listingId)
            .get()
            .addOnSuccessListener { document ->
                if (document.exists()) {
                    binding.editFoodName.setText(document.getString("name") ?: "")
                    binding.editQuantity.setText(document.getLong("quantity")?.toString() ?: "")
                    binding.editExpiryDate.setText(document.getString("expiryDate") ?: "")
                    binding.editPickupLocation.setText(document.getString("pickupLocation") ?: "")
                } else {
                    Toast.makeText(this, "Listing not found", Toast.LENGTH_SHORT).show()
                    finish()
                }
            }
            .addOnFailureListener {
                Toast.makeText(this, "Error loading listing", Toast.LENGTH_SHORT).show()
            }

        // Save button logic
        binding.saveChangesButton.setOnClickListener {
            val updatedData = hashMapOf<String, Any>(
                "name" to binding.editFoodName.text.toString().trim(),
                "quantity" to (binding.editQuantity.text.toString().trim().toLongOrNull() ?: 0L),
                "expiryDate" to binding.editExpiryDate.text.toString().trim(),
                "pickupLocation" to binding.editPickupLocation.text.toString().trim()
            )


            db.collection("foodItems").document(listingId)
                .update(updatedData)
                .addOnSuccessListener {
                    Toast.makeText(this, "Listing updated successfully", Toast.LENGTH_SHORT).show()
                    finish()
                }
                .addOnFailureListener {
                    Toast.makeText(this, "Update failed: ${it.message}", Toast.LENGTH_SHORT).show()
                }
        }

        // Delete button logic
        binding.deleteButton.setOnClickListener {
            db.collection("foodItems").document(listingId)
                .delete()
                .addOnSuccessListener {
                    Toast.makeText(this, "Listing deleted", Toast.LENGTH_SHORT).show()
                    finish()
                }
                .addOnFailureListener {
                    Toast.makeText(this, "Delete failed: ${it.message}", Toast.LENGTH_SHORT).show()
                }
        }
    }
}
