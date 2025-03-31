package com.bytesquad.rescuebites

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
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

        Glide.with(holder.itemView.context)
            .load(item.imageUrl)
            .placeholder(android.R.drawable.ic_menu_report_image) // fallback while loading
            .error(android.R.drawable.ic_delete) // fallback if loading fails
            .into(holder.binding.foodImage)
    }


    override fun getItemCount(): Int = foodList.size
}
