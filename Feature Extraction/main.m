% -------------------------------------------------------------------------
% Simple example script for sketch classification. Operates on the features
% introduced in:
%
% @article{eitz2012hdhso,
%  author = {Eitz, Mathias and Hays, James and Alexa, Marc},
%  title = {How Do Humans Sketch Objects?},
%  journal = {ACM Transactions on Graphics (Proceedings SIGGRAPH)},
%  year = {2012},
%  volume = {31},
%  number = {4},
%  pages = {44:1--44:10}
% }
%
% Copyright Mathias Eitz 2012, m.eitz@tu-berlin.de
% -------------------------------------------------------------------------

clear;

% histograms computed using soft kernel codebook coding [Philbin et al. 08]
filename_features = 'features_shog_smooth.mat';

% histograms computed using hard codebook assignment [Sivic and Zisserman 03]
%filename_features = 'features_shog_hard.mat';

% Load dataset. We expect that the file contains a single large
% matrix called 'A'. First column: category id in [1,250]; second column:
% partition id in [1,10] subdividing the dataset into ten equally sized
% subsets. Remaining 500 columns: feature data.
load(filename_features);

% The dataset is partitioned into 10 partitions of equal size. To make the
% computation fast, we select partition 1 (2000 sketches) as the 'training'
% dataset for knn classification and partition 2 (also 2000 sketches) as
% the 'test' dataset.
partition_train = A(:,2) == 1;
partition_test = A(:,2) == 2;

M = A(partition_train,3:end);
N = A(partition_test,3:end);

% Get ground truth categories of training and testing dataset
categories_train = A(partition_train,1);
categories_test = A(partition_test,1);


% Compute pairwise distances using squared Euclidean distance metric
D = repmat(diag(M*M'), 1, size(N,1)) - 2*M*N' + repmat(diag(N*N')',size(M,1),1);

% Perform 1 NN classification given pairwise distances, i.e. classify a
% sketch as belonging to the category of its single closest neighbor in
% the 'training' dataset
[B IX] = sort(D,1,'ascend');
categories_predicted = categories_train(IX(1,:));


% Output percentage of correctly classified sketches
num_correct = sum(categories_predicted == categories_test);
disp(['Sketches correctly classified: ' num2str(num_correct*100 / numel(categories_test)) '% (chance is 0.4%)']);