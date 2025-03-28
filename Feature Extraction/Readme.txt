Contains Matlab readable features used for computational sketch classification in the following publication:

@article{eitz2012hdhso,
author = {Eitz, Mathias and Hays, James and Alexa, Marc},
title = {How Do Humans Sketch Objects?},
journal = {ACM Transactions on Graphics (Proceedings SIGGRAPH)},
year = {2012},
volume = {31},
number = {4},
pages = {44:1--44:10}
}

If you make use of this dataset in a publication, please cite our work.

The archive contains the following files:

* features_shog_smooth.mat:
A 20.000 x 502 matrix. Each row in this matrix corresponds to a sketch. The first column contains an integer category id in the range [1,250] that identifies a sketch as belonging to one of 250 categories. The second columns contains an integer partition id in the range [1,10] that identifies 10 similarly sized subsets of the whole datasets that we used for computing classifier performance for increasingly larger training dataset sizes (see Figure 10 in the paper). The remaining 500 columns contain the 500-dimensional feature for the sketch. Depending on your classifier you might want to further process this data (normalization, whitening, dimensionality reduction etc).

* features_shog_hard.mat:
A 20.000 x 502 matrix. Same layout as features_shog_smooth.mat but the features have been computed using hard codebook assignment instead of soft kernel codebook coding.

* main.m
Simple example Matlab script that demonstrates loading the feature data. The script then 'trains' a simple knn classifier using a small subset of the whole dataset while testing with another disjunct subset. This example is extremely simplified in order to return results as quickly as possible for demonstration purposes.

* map_id_label.txt:
A comma separated value file that contains the mapping from an integer category id to its name (i.e. 1 -> 'airplane')


Contact:
m.eitz@tu-berlin.de

