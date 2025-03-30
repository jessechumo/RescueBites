package com.bytesquad.rescuebites

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bytesquad.rescuebites.databinding.ItemFoodListingBinding

class FoodListingAdapter(
    private val foodList: List<FoodItem>
) : RecyclerView.Adapter<FoodListingAdapter.FoodViewHolder>() {

    inner class FoodViewHolder(val binding: ItemFoodListingBinding) :
        RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): FoodViewHolder {
        val binding = ItemFoodListingBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return FoodViewHolder(binding)
    }

    override fun onBindViewHolder(holder: FoodViewHolder, position: Int) {
        val item = foodList[position]
        holder.binding.foodInfo.text = "Food: ${item.type} - Qty: ${item.quantity}\nExp: ${item.expiryDate}\nLocation: ${item.pickupLocation}"

        // Optional: Add delete/edit button handling if needed
    }

    override fun getItemCount(): Int = foodList.size
}
