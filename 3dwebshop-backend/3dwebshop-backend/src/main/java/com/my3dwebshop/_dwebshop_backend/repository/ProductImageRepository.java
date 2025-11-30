package com.my3dwebshop._dwebshop_backend.repository;

import com.my3dwebshop._dwebshop_backend.model.ProductImage;
import com.my3dwebshop._dwebshop_backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProductOrderByOrderIndexAsc(Product product);
}
