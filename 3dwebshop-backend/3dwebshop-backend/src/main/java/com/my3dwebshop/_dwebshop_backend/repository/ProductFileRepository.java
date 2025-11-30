package com.my3dwebshop._dwebshop_backend.repository;

import com.my3dwebshop._dwebshop_backend.model.ProductFile;
import com.my3dwebshop._dwebshop_backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductFileRepository extends JpaRepository<ProductFile, Long> {
    List<ProductFile> findByProduct(Product product);
}
